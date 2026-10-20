import { Link } from '@driif/motiv/matrix';

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
