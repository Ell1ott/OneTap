import { cssInterop } from 'nativewind';
import { ComponentType } from 'react';

export function iconWithClassName(icon: ComponentType<any>) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
        width: true,
        height: true,
      },
    },
  });
}
