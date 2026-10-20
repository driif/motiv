import { Progress } from '@driif/motiv/matrix';

export function ProgressDemo() {
  return (
    <>
      <Progress value={62} label="Uploading" />
      <Progress value={100} label="Done" />
    </>
  );
}
