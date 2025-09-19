import * as entity from './features/entity';
import * as grammar from './features/grammar';
import * as headers from './features/headers';
import * as method from './features/method';
import * as protocolParameter from './features/protocolParameter';
import * as status from './features/status';
import * as version from './features/version';

type TestFn = () => void | Promise<void>;

type TestModule = Record<string, unknown>;

async function runSuite(name: string, suite: TestModule): Promise<void> {
  for (const [exportName, candidate] of Object.entries(suite)) {
    if (!exportName.startsWith('test_')) continue;
    if (typeof candidate !== 'function') continue;

    const result = (candidate as TestFn)();
    await Promise.resolve(result);
    console.log(`✓ ${name} :: ${exportName}`);
  }
}

async function main(): Promise<void> {
  await runSuite('method', method);
  await runSuite('version', version);
  await runSuite('status', status);
  await runSuite('headers', headers);
  await runSuite('entity', entity);
  await runSuite('grammar', grammar);
  await runSuite('protocolParameter', protocolParameter);
  console.log('All tests passed');
}

main().catch((error) => {
  console.error('Test run failed:', error);
  process.exitCode = 1;
});
