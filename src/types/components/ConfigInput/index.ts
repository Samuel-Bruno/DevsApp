type ConfigInputProps = {
  type: string;
  title: string;
  placeholder: string;
  error?: {
    status: boolean;
    message: string;
  } | null;
  value: string;
  onChange: (t: string) => void;
  disabled?: boolean
}


export default ConfigInputProps