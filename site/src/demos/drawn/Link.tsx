import { Link } from '@driif/motiv/drawn';

export function LinkDemo() {
  return (
    <>
      <Link href="#getting-started">Back to the start</Link>
      <Link href="https://github.com/driif/motiv" external>
        Source on GitHub
      </Link>
    </>
  );
}
