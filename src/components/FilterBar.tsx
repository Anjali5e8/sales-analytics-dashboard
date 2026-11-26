import { memo } from "react";
import { CATEGORIES, REGIONS } from "../api";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearFilters, selectFilters, setCategory, setQuery, setRegion } from "../features/ordersSlice";

function FilterBarBase() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  return (
    <div className="filters" role="search">
      <label>
        Region
        <select value={filters.region} onChange={(e) => dispatch(setRegion(e.target.value))}>
          <option>All</option>
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label>
        Category
        <select value={filters.category} onChange={(e) => dispatch(setCategory(e.target.value))}>
          <option>All</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        Order ID
        <input
          type="search"
          placeholder="e.g. ORD-10042"
          value={filters.query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
      </label>
      <button type="button" className="ghost" onClick={() => dispatch(clearFilters())}>
        Clear filters
      </button>
    </div>
  );
}

export const FilterBar = memo(FilterBarBase);
