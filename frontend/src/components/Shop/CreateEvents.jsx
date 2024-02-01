import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { createEvent } from "../../redux/actions/event";
import { getAllSectionsOfAdmin } from "../../redux/actions/section";
import { Button } from "@material-ui/core";

const CreateEvents = () => {
  const { user } = useSelector((state) => state.user);
  const { success, error } = useSelector((state) => state.events);
  const { adminSections } = useSelector((state) => state.sections);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState(["forceArray"]);
  const [priceCheck, setPriceCheck] = useState(20000);
  const [numChecks, setNumChecks] = useState(3);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [investCompany, setInvestCompany] = useState(32);
  const [investRound, setInvestRound] = useState(20);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("end-date").min = minEndDate
      .toISOString()
      .slice(0, 10);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };
  useEffect(() => {
    dispatch(getAllSectionsOfAdmin(user._id));
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!");
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    e.preventDefault();
    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleButtonClick = (option) => {
    if (sections.includes(option)) {
      // If option is already selected, remove it
      setSections(
        sections.filter((selectedOption) => selectedOption !== option)
      );
    } else {
      // If option is not selected, add it
      setSections((sections) => [...sections, option]);
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : today;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sections.length !== 0) {
      const newForm = new FormData();
      images.forEach((image) => {
        newForm.append("images", image);
      });
      sections.forEach((section) => {
        newForm.append("sections", section);
      });
      newForm.append("adminId", user._id);
      newForm.append("name", name);
      newForm.append("description", description);
      newForm.append("maxInvestmentsCompany", investCompany);
      newForm.append("maxInvestmentsRound", investRound);
      newForm.append("numChecks", numChecks);
      newForm.append("checkPrice", priceCheck);
      newForm.append("start_Date", startDate.toISOString());
      newForm.append("finish_Date", endDate.toISOString());

      dispatch(createEvent(newForm));
      toast.success("New event created!");
    } else {
      toast.error("Please select a section");
    }
  };
  return (
    <div className="800px:w-[50%] w-[90%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Round</h5>
      {/* Form */}
      <form onSubmit={handleSubmit} aria-required={true}>
        <br />
        <div>
          <label className="pb-2">Name</label>
          <input
            type="text"
            required
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter investment round name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Description</label>
          <textarea
            cols="30"
            rows="8"
            type="text"
            required
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-3 px-3  border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Applied Sections:</label>
          <div className="flex flex-col items-center">
            {adminSections &&
              adminSections.map((i, index) => (
                <Button
                  key={index}
                  className="w-[50%]"
                  type="button"
                  onClick={() => handleButtonClick(i.name)}
                  style={{
                    color: sections.includes(i.name) ? "#FF0000" : "#000000",
                  }}
                >
                  {i.name}
                </Button>
              ))}
          </div>
        </div>
        <br />
        <div>
          <label className="pb-2">Number of checks</label>
          <input
            required
            type="number"
            name="numChecks"
            value={numChecks}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setNumChecks(e.target.value)}
            placeholder="Number of checks..."
            min={0}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Check Amount</label>
          <input
            required
            type="number"
            name="priceCheck"
            value={priceCheck}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setPriceCheck(e.target.value)}
            placeholder="Check amount..."
            min={0}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Max Investments</label>
          <input
            required
            type="number"
            name="investRound"
            value={investRound}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setInvestRound(e.target.value)}
            placeholder="Enter max..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Max Investments per Company</label>
          <input
            required
            type="number"
            name="investCompany"
            value={investCompany}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setInvestCompany(e.target.value)}
            placeholder="Enter max..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Event Start Date</label>
          <input
            required
            type="date"
            name="date"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Event End Date</label>
          <input
            required
            type="date"
            name="date"
            id="end-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Upload Images</label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <label htmlFor="upload">
            <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
          </label>
          <div className="w-full flex items-center flex-wrap">
            {" "}
            {images &&
              images.map((i) => (
                <img
                  className="h-[120px] w-[120px] m-2 object-cover"
                  src={URL.createObjectURL(i)}
                  key={i}
                ></img>
              ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              name=""
              id=""
              value="Create"
              className="mt-2 cursor-pointer appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvents;
