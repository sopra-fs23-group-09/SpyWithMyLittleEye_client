import "styles/ui/Button.scss";

export const Button = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`${props.className}`}>
      {props.children}
    </button>
);
