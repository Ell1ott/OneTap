import React, { useState } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import { addDeafultTasks, categories$, events$, supabase, todos$, user$ } from './SupaLegend';
import { Button, Input } from '@rneui/themed';
import { toast } from 'sonner-native';
import { AuthTokenResponsePassword, User } from '@supabase/supabase-js';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (!supabase) return;
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export default function Auth({ closeAuthPage }: { closeAuthPage: () => void }) {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // supabase.auth.onAuthStateChange((event, session) => {
    //     console.log(event, session)
    //     if (event === 'INITIAL_SESSION' && session?.user.email) {
    //         router.push('/')
    //     }
    // })

    async function signInWithEmail() {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        console.log(data);

        console.log(error);

        if (error) toast.error(error.message);
        if (data?.user?.email && data?.user?.email !== '') {
            onSignIn(data.user);
        }

        setLoading(false);
    }


    async function onSignIn(user: User) {

        if (!user) {
            toast.error('Signed in failed');
            return;
        };

        // if (data.weakPassword) {
        //     toast.error('Weak password');
        //     return;
        // }
        closeAuthPage();
        toast.info('Singed into ' + user.email);
        const { data: todoData, error: todoError } = await supabase.from('todos').select('*');
        const { data: eventData, error: eventError } = await supabase.from('events').select('*');
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('*');
        if (firstName && firstName !== '') {
            const { data: userData, error: userError } = await (firstName
                ? supabase
                    .from('users')
                    .upsert(
                        {
                            first_name: firstName,
                        },
                        { onConflict: 'user_id' }
                    )
                    .select()
                    .single()
                : supabase.from('users').select('*').eq('user_id', user.id).single());
            if (userError) toast.error(userError.message);
            if (userData) user$.set(userData);
        }

        const todoDict: Record<string, any> = {};
        const eventDict: Record<string, any> = {};
        const categoryDict: Record<string, any> = {};

        todoData?.forEach((todo) => {
            todoDict[todo.id] = todo;
        });
        console.log(todoDict);
        todos$.set(todoDict);

        eventData?.forEach((event) => {
            eventDict[event.id] = event;
        });
        console.log(eventDict);
        events$.set(eventDict);

        categoryData?.forEach((category) => {
            categoryDict[category.id] = category;
        });
        console.log(categoryDict);
        categories$.set(categoryDict);

    }
    async function signUpWithEmail() {
        if (!firstName || firstName === '') {
            toast.error('First name is required, when signing up');
            return;
        }

        setLoading(true);
        const {
            data: { session, user },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) toast.error(error.message);

        if (user?.email && user?.email !== '') {
            await onSignIn(user);
            setTimeout(() => {
                addDeafultTasks();
            }, 100);
        }

        if (!session) toast.info('Please check your inbox for email verification!');
        setLoading(false);

    }

    return (
        <View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    label="First Name"
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onChangeText={(text) => setFirstName(text)}
                    value={firstName}
                    placeholder="First Name"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
            </View>
            <View style={styles.verticallySpaced}>
                <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
});
