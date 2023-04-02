import {
  FormEventHandler,
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type TextFieldProps = {
  id: string;
  onInput?: () => void;
  onChange?: () => void;
  className?: string;
  default?: string;
  placeholder?: string;
};
type TextFieldHandle = {
  value: () => string;
};

const TextFieldImpl: ForwardRefRenderFunction<
  TextFieldHandle,
  TextFieldProps
> = (props, ref) => {
  const [value, setValue] = useState(props.default || "");
  useEffect(() => setValue(props.default || ""), [props.default]);

  useImperativeHandle(ref, () => ({
    value() {
      return value;
    },
  }));

  const onInput: FormEventHandler<HTMLInputElement> = (evt) => {
    try {
      const targetElem = evt.target as HTMLInputElement;
      setValue(targetElem.value);
      if (props.onInput) props.onInput();
    } catch (_) {}
  };
  const onChange: FormEventHandler<HTMLInputElement> = (evt) => {
    try {
      const targetElem = evt.target as HTMLInputElement;
      setValue(targetElem.value);
      if (props.onChange) props.onChange();
    } catch (_) {}
  };
  return (
    <input
      type="text"
      id={props.id}
      className={props.className}
      placeholder={props.placeholder}
      value={value}
      onInput={onInput}
      onChange={onChange}
      autoComplete="off"
    />
  );
};

export const TextField = forwardRef(TextFieldImpl);
