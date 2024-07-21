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
import ProfileModal from "../modals/ProfileModal";

export default function Customers() {
  const [clientsData, setClientsData] = useState<Client[]>([] as Client[]);
  const [deleteClicked, setDeleteClicked] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [profileClicked, setProfileClicked] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<number>(0);
  const [clientInstagram, setClientInstagram] = useState<string>("");
  const [clientMail, setClientMail] = useState<string>("");
  const [clientNote, setClientNote] = useState<string>("");

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
      const clientDocRef = doc(db, `users/${user!.uid}/clients/${clientId}`);
      await deleteDoc(clientDocRef);
      setClientsData(
        clientsData.filter((client: Client) => client.id !== clientId)
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

  function closeProfileModal() {
    setProfileClicked(false);
  }

  return (
    <div className="client-container">
      {deleteClicked && (
        <DeleteModal
          heading={"klijenta"}
          close={closeDeleteModal}
          confirm={confirmDelete}
        />
      )}
      {profileClicked && (
        <ProfileModal
          heading={"Klijent"}
          name = {clientName}
          phone={clientPhone}
          instagram={clientInstagram}
          mail={clientMail}
          note={clientNote}
          close={closeProfileModal}
        />
      )}
      <div className="client-title-container">Klijenti</div>
      <div className="new-client-container">

      </div>
      {clientsData?.length &&
        clientsData.map((client: any) => (
          <div key={client.id} className="client-container">
            <div className="client-info-container">
              <span className="client-name">{client.name}</span>
              <span className="client-phone">{client.phone}</span>
            </div>

            <div className="client-icons-container">
              <div
                className="profile-icon-container"
                onClick={() => {
                  setProfileClicked(true);
                  setClientName(client.name);
                  setClientPhone(client.phone);
                  setClientInstagram(client.instagram);
                  setClientMail(client.email);
                  setClientNote(client.note);
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 30 }} />
              </div>
              <div className="edit-icon-container">
                <CreateIcon sx={{ fontSize: 30 }} />
              </div>
              <div
                className="delete-icon-container"
                onClick={() => {
                  setDeleteClicked(true);
                  setSelectedClient(client.id);
                }}
              >
                <DeleteIcon sx={{ fontSize: 30 }} />
              </div>
            </div>
          </div>
        ))}

      <NavBar />
    </div>
  );
}