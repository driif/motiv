import { MorphSubmitButton } from '@driif/motiv';

const saveProfile = () => new Promise((resolve) => setTimeout(resolve, 1200));
const publishOffline = () =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('offline')), 900));

export function MorphSubmitButtonDemo() {
  return (
    <>
      <MorphSubmitButton onAction={saveProfile} />
      <MorphSubmitButton onAction={publishOffline} label="Publish (fails)" />
    </>
  );
}
