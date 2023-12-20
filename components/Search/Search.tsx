import s from "./Search.module.scss";
import Button from "@/bases/Button/Button";
import { Input } from "@/bases/input";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Search as SearchIcon } from "react-feather";

export type SearchProps = {
  cta: string;
  placeholder: string;
  onCtaClick: () => void;
  onSearch: (s: string) => void;
};

export default function Search(props: SearchProps) {
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setSearch("");
  }, []);

  const handleSearch = (e: FormEvent) => {
    e?.preventDefault();
    props.onSearch(search);
  };

  return (
    <form onSubmit={handleSearch} className={s["ds-search"]}>
      <div className={s["ds-search__left"]}>
        <span>Filter</span>
        <Input
          placeholder={props.placeholder}
          value={search}
          onChange={(v) => setSearch(v.target.value)}
        />
      </div>
      <div className={s["ds-search__right"]}>
        <Button theme="SECONDARY" type="submit">
          <SearchIcon size={14} />
          Search
        </Button>
        <Button type="button" theme="CTA" onClick={props.onCtaClick}>
          {props.cta} <ArrowRight size={14} />
        </Button>
      </div>
    </form>
  );
}
