import { Task } from '@serenity-js/core';

describe('Source maps support', () => {
    it('should detect line number correctly', async () => {
        const [ message, ...frames ] = fn1();

        expect(message).toEqual('Error: Caller location marker')

        // @ts-ignore
        const locations = frames.map(frame => frame.match(/.*\/(.*?\d+:\d+)/)[1]).slice(0, 4)

        expect(locations).toEqual([
            'source-maps.e2e.ts:39:19',   // the line where I instantiate the Error object
            'source-maps.e2e.ts:35:12',   // fn2 calls readStack
            'source-maps.e2e.ts:31:12',   // fn1 calls fn2
            'source-maps.e2e.ts:5:40',    // fn1 called in the spec
        ])
    })

    it('should detect instantiation location of a Serenity/JS interaction', async () => {

        const location = serenityTask()     // <-- Instantiation location line should point at line 22
            .instantiationLocation();

        expect(location.line).toEqual(22)
        expect(location.column).toEqual(26)
    })
})

function fn1() {
    return fn2();
}

function fn2() {
    return readStack()
}

function readStack() {
    const error = new Error('Caller location marker');

    return (error.stack || '').split('\n');
}

const serenityTask = () =>
    Task.where(`#actor tries to reproduce a bug`)