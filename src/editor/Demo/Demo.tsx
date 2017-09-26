import * as React from 'react';
const css = require('./Demo.scss');

export function DemoTitle({title}) {
    return <h1 className={css.title}>{title}</h1>;
}

export function DemoBody({isOld}) {
    return (
        <div className={css.body}>
            { isOld && <p>You're quite big</p>}
            { !isOld && <p>Who is so cute and tiiiiiiiiiny here?...</p>}
        </div>
    );
}

export function DemoFooter({message}) {
    return (
        <div className={css.footer}>
            <p>{message}</p>
        </div>
    );
}
