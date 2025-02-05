import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { posts } from "../asset2/content.ts";

function App() {
  // const [products, setProducts] = useState(posts);
  const itemsPerPage = 10;

  const [sortId, setSortId] = useState("id");
  const [sortType, setSortType] = useState("id");

  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [paginationArr, setPaginationArr] = useState([]);
  const [selectedPegiVal, setSelectedPegiVal] = useState(1);

  const calcPaginationPage = Math.floor(posts.length / itemsPerPage);

  useEffect(() => {
    let pegiArr = [];
    for (let i = 0; i < calcPaginationPage; i++) {
      pegiArr[i] = i + 1;
    }
    setPaginationArr(pegiArr);
  }, [calcPaginationPage]);

  const filterPaginationValue = useMemo(() => {
    console.log("🚀 ~ useEffect ~ selectedPegiVal:", selectedPegiVal);
    console.log("🚀 ~ filterPaginationValue ~ itemsPerPage:", itemsPerPage);
    const startIndex = (selectedPegiVal - 1) * itemsPerPage;
    console.log("🚀 ~ filterPaginationValue ~ startIndex:", startIndex);
    const endIndex = startIndex + itemsPerPage;
    console.log("🚀 ~ filterPaginationValue ~ endIndex:", endIndex);
    return posts.slice((selectedPegiVal - 1) * itemsPerPage, endIndex);
  }, [selectedPegiVal]);

  console.log("🚀 ~ calcPaginationPage ~:", calcPaginationPage);

  const filteredProductsAfterSearch = useMemo(() => {
    return filterPaginationValue.filter((val) => {
      return Object.values(val).some((value) => {
        return value
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    });
  }, [searchText, filterPaginationValue]);

  console.log(
    "🚀 ~ filteredProductsAfterSearch ~ filteredProductsAfterSearch:",
    filteredProductsAfterSearch
  );

  const sortedAndFilteredProducts = useMemo(() => {
    // console.log("🚀 ~ sortedAndFilteredProducts ~ filterValue:", filterValue);
    // console.log("🚀 ~ sorted ~ sortId:", sortId);
    // console.log("🚀 ~ sortedAndFilteredProducts ~ sortType:", sortType);

    const filtered = filterValue
      ? filteredProductsAfterSearch.filter(
          (product) => product.category === filterValue
        )
      : filteredProductsAfterSearch;

    if (sortType == "Ascending") {
      return [...filtered].sort((a, b) => {
        if (typeof a[sortId] === "number") {
          return parseFloat(a[sortId]) - parseFloat(b[sortId]);
        } else if (Array.isArray(a[sortId]) && Array.isArray(b[sortId])) {
          let valueA = a[sortId].length > 0 ? a[sortId]?.join(", ") : "";
          let valueB = b[sortId].length > 0 ? b[sortId]?.join(", ") : "";
          if (valueB !== "" && valueA !== "") {
            return valueA.localeCompare(valueB);
          }
        } else {
          return a[sortId].localeCompare(b[sortId]);
        }
      });
    } else if (sortType == "Descending") {
      return [...filtered].sort((a, b) => {
        console.log(typeof a[sortId]);
        if (typeof a[sortId] === "number") {
          return parseFloat(b[sortId]) - parseFloat(a[sortId]);
        } else if (Array.isArray(a[sortId]) && Array.isArray(b[sortId])) {
          let valueA = a[sortId].length > 0 ? a[sortId]?.join(", ") : "";
          let valueB = b[sortId].length > 0 ? b[sortId]?.join(", ") : "";
          if (valueB !== "" && valueA !== "") {
            return valueB.localeCompare(valueA);
          }
        } else {
          return b[sortId].localeCompare(a[sortId]);
        }
      });
    } else {
      return filtered;
    }
  }, [filteredProductsAfterSearch, filterValue, sortType, sortId]);

  const selectSortId = (sortId = "id") => {
    setSortId(sortId);
  };

  return (
    <div>
      <div>
        <div id="headerTab">
          <div id="searchBtn">
            <strong>Search:</strong>
            <input
              id="searchInputBtn"
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div id="sortBtn">
            <label htmlFor="sort">
              <strong>Sort By Id:</strong>
            </label>
            <select
              onChange={(e) => selectSortId(e.target.value)}
              name="sort"
              id="sortInputBtn"
            >
              <option value="id">id</option>
              <option value="title">title</option>
              <option value="content">content</option>
              <option value="category">category</option>
              <option value="price">price</option>
            </select>
          </div>
          <div id="sortBtnVal">
            <label htmlFor="sortValue">
              <strong>Sort Type:</strong>
            </label>
            <select
              name="sortValue"
              id="sortValInputBtn"
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">Select Sort Type</option>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          <div id="FilterBtn">
            <label htmlFor="sortValue">
              <strong>Filter:</strong>
            </label>
            <select
              id="filterInputBtn"
              name="filter"
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">filter by Category</option>
              <option value="American">American</option>
              <option value="Mexican">Mexican</option>
              <option value="Italian">Italian</option>
              <option value="French">French</option>
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>title</th>
              <th>content</th>
              <th>category</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredProducts.map((val, index) => {
              let arrStr = "";
              // console.log("🚀 ~ {products.map ~ val.content:", val.content);
              if (Array.isArray(val.content)) {
                arrStr = val.content.join(",");
              }
              return (
                <tr key={index}>
                  <td>{val.id}</td>
                  <td>{val.title}</td>
                  <td>{arrStr}</td>
                  <td>{val.category}</td>
                  <td>{val.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination-box">
          {paginationArr.map((val, index) => {
            // console.log("🚀 ~ {paginationArr.forEach ~ val:", val);
            return (
              <h2
                key={index}
                name={index}
                className="pagination-item"
                onClick={() => setSelectedPegiVal(val)}
              >
                {val}
              </h2>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
