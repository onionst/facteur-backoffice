import Button from "@/bases/Button/Button";
import s from "./Navbar.module.scss";
import { Menu, Plus } from "react-feather";
import { Input } from "@/bases/input";
import IconButton from "@/bases/IconButton/IconButton";
import useWindowSize from "@/hooks/useWindowWidth";

export type NavbarProps = {
  openDrawer?: () => void;
  collapsed: boolean;
};

export default function Navbar(props: NavbarProps) {
  const { width } = useWindowSize();
  return (
    <nav
      className={s["ds-navbar"]}
      style={{ width: `calc(100% - ${props.collapsed ? 74 : 270}px)` }}
    >
      <section className={s["ds-navbar__left"]}>
        {width < 768 && (
          <IconButton onClick={props?.openDrawer}>
            <Plus color="#252f4a" size={18} />
          </IconButton>
        )}
        <Input
          className={s["ds-navbar__left-input"]}
          placeholder="Search in the EE24 dataset..."
        />
      </section>
      <section className={s["ds-navbar__right"]}>
        <Button theme="TERTIARY">
          <span>
            Create article <Plus size={14} />
          </span>
        </Button>
      </section>
    </nav>
  );
}
