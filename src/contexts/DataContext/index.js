import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  // Adding the last state variable
  const [last, setLast] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
      // Adding the sortedData constant which sorts the data by date
      const sortedDatas = (await api.loadData()).events
        .slice()
        .sort((evtA, evtB) => new Date(evtB.date) - new Date(evtA.date));
      // Passing the most recent event to the last state variable
      setLast(sortedDatas[0]);
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        // Transmission of the last variable to the provider
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
