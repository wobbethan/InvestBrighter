import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useDispatch } from "react-redux";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/companies?section=${i.name}`);
    setDropDown(false);
    window.location.reload();
  };

  useEffect(() => {}, []);
  return (
    <div className="pb-4 w-[248px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className={`${styles.normalFlex} cursor-pointer`}
            onClick={() => submitHandle(i)}
          >
            <h3 className="m-3 select-none">{i.name}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
