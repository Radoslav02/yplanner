import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Customers.scss";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import CreateIcon from "@mui/icons-material/Create";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Client } from "../../models/client";
import DeleteModal from "../modals/DeleteModal";


export default function Customers() {
  const [clientsData, setClientsData] = useState<Client[]>(
    [] as Client[]
  );
  const [deleteClicked, setDeleteClicked] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string>("");

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
      setClientsData(clientsData as Client[]);
    } catch (error) {
      console.error("Error fetching clients");
      toast.error("Error fetching clients");
    }
  }

  async function deleteAppointment(clientId: string) {
    try {
      const clientDocRef = doc(
        db,
        `users/${user!.uid}/clients/${clientId}`
      );
      await deleteDoc(clientDocRef);
      setClientsData(
        clientsData.filter(
          (client: Client) => client.id !== clientId
        )
      );
      toast.success("Termin usešno obrisan");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Error deleting appointment");
    }
  }
  function closeDeleteModal() {
    setDeleteClicked(false);
  }

  function confirmDelete() {
    deleteAppointment(selectedClient);
  }

  return (
    <div className="customers-container">
       {deleteClicked && (
        <DeleteModal
          heading={"termin"}
          close={closeDeleteModal}
          confirm={confirmDelete}
        />
      )}
      <div className="customers-title-container">Musterije</div>
      {clientsData?.length &&
        clientsData.map((client: any) => (
          <div className="client-container">
            <div className="client-info-container">
              <span className="client-name">{client.name}</span>
              <span className="client-phone">{client.phone}</span>
            </div>

            <div className="client-icons-container">
              <div className="profile-icon-container">
                <AccountCircleIcon sx={{ fontSize: 30 }} />
              </div>
              <div className="edit-icon-container">
                <CreateIcon sx={{ fontSize: 30 }} />
              </div>
              <div className="delete-icon-container" onClick={() => {
                  setDeleteClicked(true);
                  setSelectedClient(client.id);
              }}>
                <DeleteIcon sx={{ fontSize: 30 }} />
              </div>
            </div>
          </div>
        ))}

      <NavBar />
    </div>
  );
}
