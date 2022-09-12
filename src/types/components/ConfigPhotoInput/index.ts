type ConfigPhotoInputProps = {
  title: string;
  img: string;
  setChoosedPhotoFile: (f: File) => void
  choosedPhotoUrl: string | null;
  setChoosedPhotoUrl: (t: string) => void;
}


export default ConfigPhotoInputProps