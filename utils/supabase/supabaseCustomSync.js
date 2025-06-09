import { observable, computeSelector, isFunction, isObject, symbolDelete } from '@legendapp/state';
import {
  removeNullUndefined,
  createRevertChanges,
  transformStringifyDates,
  combineTransforms,
} from '@legendapp/state/sync';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';

// src/sync-plugins/supabase.ts
var channelNum = 1;
var supabaseConfig = {};
var isEnabled$ = observable(true);
function getSyncedSupabaseConfiguration() {
  return supabaseConfig;
}
function configureSyncedSupabase(config) {
  const { enabled, ...rest } = config;
  if (enabled !== void 0) {
    isEnabled$.set(enabled);
  }
  Object.assign(supabaseConfig, removeNullUndefined(rest));
}
function wrapSupabaseFn(fn, source) {
  return async (params, ...args) => {
    const { onError } = params;
    const { data, error } = await fn(params, ...args);
    if (error) {
      onError(new Error(error.message), {
        getParams: params,
        source,
        type: 'get',
        retry: params,
      });
    }
    return data;
  };
}
function handleSupabaseError(error, onError, params) {
  var _a;
  if ((_a = error.message) == null ? void 0 : _a.includes('Failed to fetch')) {
    throw error;
  } else {
    onError(new Error(error.message), params);
  }
}
function syncedSupabase(props) {
  props = { ...supabaseConfig, ...props };
  const {
    supabase,
    collection,
    select: selectFn,
    schema,
    filter,
    actions,
    fieldCreatedAt,
    fieldUpdatedAt,
    fieldDeleted,
    realtime,
    fieldId = 'id',
    changesSince,
    transform: transformParam,
    stringifyDates,
    waitFor,
    waitForSet,
    generateId,
    mode,
    list: listParam,
    create: createParam,
    update: updateParam,
    delete: deleteParam,
    ...rest
  } = props;
  const client = supabase;
  if (process.env.NODE_ENV === 'development' && changesSince === 'last-sync') {
    if (!fieldCreatedAt) {
      console.warn('[legend-state] fieldCreatedAt is required when using last-sync mode');
    }
    if (!fieldUpdatedAt) {
      console.warn('[legend-state] fieldUpdatedAt is required when using last-sync mode');
    }
    if (!fieldDeleted) {
      console.warn('[legend-state] fieldDeleted is required when using last-sync mode');
    }
  }
  const list =
    !actions || actions.includes('read')
      ? listParam
        ? wrapSupabaseFn(listParam, 'list')
        : async (params) => {
            const { lastSync, onError } = params;
            const clientSchema = schema ? client.schema(schema) : client;
            const from = clientSchema.from(collection);
            let select = selectFn ? selectFn(from) : from.select();
            if (changesSince === 'last-sync' && lastSync) {
              const date = new Date(lastSync).toISOString();
              select = select.gt(fieldUpdatedAt, date);
            }
            if (filter) {
              select = filter(select, params);
            }
            const { data, error } = await select;
            if (data) {
              return data || [];
            } else if (error) {
              handleSupabaseError(error, onError, {
                getParams: params,
                source: 'list',
                type: 'get',
                retry: params,
              });
            }
            return null;
          }
      : void 0;
  const create = createParam
    ? wrapSupabaseFn(createParam, 'create')
    : !actions || actions.includes('create')
      ? async (input, params) => {
          const { onError } = params;
          const res = await client.from(collection).insert(input).select();
          const { data, error } = res;
          if (data) {
            const created = data[0];
            return created;
          } else if (error) {
            handleSupabaseError(error, onError, {
              setParams: params,
              source: 'create',
              type: 'set',
              retry: params,
              input,
              revert: createRevertChanges(params.value$, params.changes),
            });
          }
        }
      : void 0;
  const update =
    !actions || actions.includes('update')
      ? updateParam
        ? wrapSupabaseFn(updateParam, 'update')
        : async (input, params) => {
            params.value$.updated_at.set(new Date().toISOString());
            console.log('sb input', params.value$.updated_at.get());

            const { onError } = params;
            const res = await client
              .from(collection)
              .update(input)
              .eq(fieldId, input[fieldId])
              .select();
            const { data, error } = res;
            if (data) {
              const created = data[0];
              return created;
            } else if (error) {
              handleSupabaseError(error, onError, {
                setParams: params,
                source: 'update',
                type: 'set',
                retry: params,
                input,
                revert: createRevertChanges(params.value$, params.changes),
              });
            }
          }
      : void 0;
  const deleteFn =
    !fieldDeleted && (!actions || actions.includes('delete'))
      ? // prettier-ignore
        deleteParam ? wrapSupabaseFn(deleteParam, "delete") : async (input, params) => {
      const { onError } = params;
      const res = await client.from(collection).delete().eq(fieldId, input[fieldId]).select();
      const { data, error } = res;
      if (data) {
        const created = data[0];
        return created;
      } else if (error) {
        handleSupabaseError(error, onError, {
          setParams: params,
          source: "delete",
          type: "set",
          retry: params,
          input,
          revert: createRevertChanges(params.value$, params.changes)
        });
      }
    }
      : void 0;
  const subscribe = realtime
    ? ({ node, value$, update: update2 }) => {
        const { filter: filter2, schema: schema2 } = isObject(realtime) ? realtime : {};
        const channel = client
          .channel(`LS_${node.key || ''}${channelNum++}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              table: collection,
              schema: schema2 || 'public',
              filter: filter2 || void 0,
            },
            (payload) => {
              var _a;
              const { eventType, new: value, old } = payload;
              if (eventType === 'INSERT' || eventType === 'UPDATE') {
                const cur = (_a = value$.peek()) == null ? void 0 : _a[value[fieldId]];
                let isOk = !fieldUpdatedAt;
                let lastSync = void 0;
                if (!isOk) {
                  const curDateStr =
                    cur &&
                    ((fieldUpdatedAt && cur[fieldUpdatedAt]) ||
                      fieldCreatedAt ||
                      cur[fieldCreatedAt]);
                  const valueDateStr =
                    (fieldUpdatedAt && value[fieldUpdatedAt]) ||
                    (fieldCreatedAt && value[fieldCreatedAt]);
                  lastSync = +new Date(valueDateStr);
                  isOk = valueDateStr && (!curDateStr || lastSync > +new Date(curDateStr));
                  console.log(
                    'is newer',
                    isOk,
                    +new Date(valueDateStr),
                    +new Date(curDateStr),
                    lastSync - +new Date(curDateStr)
                  );
                }
                if (isOk) {
                  update2({
                    value: [value],
                    lastSync,
                    mode: 'merge',
                  });
                }
              } else if (eventType === 'DELETE') {
                old[symbolDelete] = true;
                update2({
                  value: [old],
                });
              }
            }
          )
          .subscribe();
        return () => channel.unsubscribe();
      }
    : void 0;
  let transform = transformParam;
  if (stringifyDates) {
    const stringifier = transformStringifyDates();
    transform = transform ? combineTransforms(stringifier, transform) : stringifier;
  }
  return syncedCrud({
    ...rest,
    mode: mode || 'merge',
    list,
    create,
    update,
    delete: deleteFn,
    subscribe,
    fieldCreatedAt,
    fieldUpdatedAt,
    fieldDeleted,
    updatePartial: false,
    fieldId,
    transform,
    generateId,
    waitFor: () => isEnabled$.get() && (waitFor ? computeSelector(waitFor) : true),
    waitForSet: (params) =>
      isEnabled$.get() &&
      (waitForSet ? (isFunction(waitForSet) ? waitForSet(params) : waitForSet) : true),
  });
}

export { configureSyncedSupabase, getSyncedSupabaseConfiguration, syncedSupabase };
