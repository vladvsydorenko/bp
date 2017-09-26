import * as React from 'react';
const css = require('./BPCodeViewer.scss');

export function BPCodeViewer({codeMostJs, codeRxJs}: {codeRxJs: string, codeMostJs: string}) {
    return (
        <div className={css.viewer}>
            {/*<div className={css.note}>This page will updated automatically according to Editor</div>*/}
            <div className={css.left}>
                <h1 className={css.title}>MostJs</h1>
                <pre><code className="js">{codeMostJs}</code></pre>
            </div>
            <div className={css.right}>
                <h1 className={css.title}>RxJs</h1>
                <pre><code className="js">{codeRxJs}</code></pre>
            </div>
        </div>
    );
}
