import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Customers.scss";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import CustomerCard from "../CustomerCard/CustomerCard";

export default function Customers() {
  const [clientsData, setClientsData] = useState<any>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.uid) {
      fetchClients();
    }
  }, [user]);

  useEffect(() => {
    console.log(clientsData);
  }, [clientsData]);

  async function fetchClients() {
    try {
      const clientsCollectionRef = collection(db, `users/${user!.uid}/clients`);
      const clientDocs = await getDocs(clientsCollectionRef);
      const clientsData = clientDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientsData(clientsData);
    } catch (error) {
      console.error("Error fetching clients");
      toast.error("Error fetching clients");
    }
  }

  return (
    <div className="customers-container">

      <div className="customers-title-container">
        <h1>Mušterije</h1>
      </div>


      {clientsData?.length &&
        clientsData.map((client: any) => (
          <div key={client.id}>
            <CustomerCard name={client.name} phone={client.phone} />
          </div>
        ))}

      <NavBar />
    </div>
  );
}
