type ConfigMenuItemProps = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
  onClick: () => void
}


export default ConfigMenuItemProps