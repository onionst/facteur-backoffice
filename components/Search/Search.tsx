import s from "./Search.module.scss";
import Button from "@/bases/Button/Button";
import { Input } from "@/bases/input";
import { ArrowRight, Search as SearchIcon } from "react-feather";

export type SearchProps = {
  cta: string;
  placeholder: string;
  onCtaClick: () => void;
};

export default function Search(props: SearchProps) {
  return (
    <div className={s["ds-search"]}>
      <div className={s["ds-search__left"]}>
        <span>Filter</span>
        <Input placeholder={props.placeholder} />
      </div>
      <div className={s["ds-search__right"]}>
        <Button theme="SECONDARY">
          <SearchIcon size={14} />
          Search
        </Button>
        <Button theme="CTA" onClick={props.onCtaClick}>
          {props.cta} <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
