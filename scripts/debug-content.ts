import { getContent } from '../src/lib/content';

async function test() {
    console.log('Testing getContent...');
    const id = 'thought-relationship';
    const content = await getContent(id);
    console.log('Result:', content);

    const id2 = 'cat-passions';
    const content2 = await getContent(id2);
    console.log('Result 2:', content2);
}

test().catch(console.error);
