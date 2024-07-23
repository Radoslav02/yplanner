import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Clients.scss";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Client } from "../../models/client";
import DeleteModal from "../modals/DeleteModal";
import ShowProfileModal from "../modals/ShowProfileModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NewClientModal from "../modals/NewClientModal";
import EditClientModal from "../modals/EditClientModal";
import SearchIcon from "@mui/icons-material/Search";
import Loading from "../Loading/Loading";

export default function Customers() {
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [deleteClicked, setDeleteClicked] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [profileClicked, setProfileClicked] = useState<boolean>(false);
  const [addClientClicked, setAddClientClicked] = useState<boolean>(false);
  const [editClientClicked, setEditClientClicked] = useState<boolean>(false);
  const [searchedClient, setSearchedClient] = useState<string>("");
  const [filteredClientsData, setFilteredClientsData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true)
    try {
      const clientsCollectionRef = collection(db, `users/${user!.uid}/clients`);
      const clientDocs = await getDocs(clientsCollectionRef);

      const clientsData: Client[] = clientDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Client, "id">),
      }));

      const sortedClients = clientsData.sort((a, b) => {
        const nameA = a.name;
        const nameB = b.name;
        return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
      });

     
      setClientsData(sortedClients);
      setFilteredClientsData(sortedClients);
      
    } catch (error) {
      console.error("Error fetching clients", error);
      toast.error("Error fetching clients");
    }finally{
      setIsLoading(false);
    }
  }

  async function addClient(newClient: Client) {
    const clientExist = clientsData.some(
      (client) => client.name === newClient.name
    );
    if (clientExist) {
      toast.error("Klijent sa unetim imenom već postoji");
      return;
    }

    if (!newClient.name) {
      toast.error("Morate dodati ime klijentu! ");
      return;
    }

    try {
      const clientsCollectionRef = collection(db, `users/${user!.uid}/clients`);
      await addDoc(clientsCollectionRef, newClient);

      fetchClients();
      toast.success("Klijent uspešno dodat");
      closeAddClientModal();
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Greška pri dodavanju klijenta");
    }
  }

  async function deleteClient(clientId: string) {
    try {
      const clientDocRef = doc(db, `users/${user!.uid}/clients/${clientId}`);
      await deleteDoc(clientDocRef);
      setClientsData(
        clientsData.filter((client: Client) => client.id !== clientId)
      );
      toast.success("Klijent uspešno obrisan");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Greška pri brisanju klijenta");
    }
  }

  async function editClient(clientId: string, updatedClient: Client) {
    try {
      const clientDocRef = doc(db, `users/${user!.uid}/clients/${clientId}`);
      await updateDoc(clientDocRef, updatedClient as { [key: string]: any });

      setClientsData(
        clientsData.map((client: Client) =>
          client.id === clientId ? { ...client, ...updatedClient } : client
        )
      );

      toast.success("Klijent uspešno izmenjen");
      closeEditClientModal();
    } catch (error) {
      console.error("Error editing client:", error);
      toast.error("Greška pri izmeni klijenta");
    }
  }

  function closeDeleteModal() {
    setDeleteClicked(false);
  }

  function confirmDelete() {
    if (selectedClient) {
      deleteClient(selectedClient);
    }
  }

  function confirmAddClient(newClient: Client) {
    addClient(newClient);
  }

  function confirmEditClient(updatedClient: Client) {
    if (selectedClient) {
      editClient(selectedClient, updatedClient);
    }
  }

  function closeProfileModal() {
    setProfileClicked(false);
  }

  function closeAddClientModal() {
    setAddClientClicked(false);
  }

  function closeEditClientModal() {
    setEditClientClicked(false);
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value;
    setSearchedClient(searchValue);

    if (searchValue === "") {
      setFilteredClientsData(clientsData);
    } else {
      setFilteredClientsData(
        clientsData.filter((client) =>
          client.name.toLowerCase().startsWith(searchValue.toLowerCase())
        )
      );
    }
  }

  return (
    <div className="client-container-wrapper">
      {deleteClicked && (
        <DeleteModal
          heading={"klijenta"}
          close={closeDeleteModal}
          confirm={confirmDelete}
        />
      )}

      {profileClicked && (
        <ShowProfileModal
          heading={"Klijent"}
          name={clientName}
          phone={clientPhone}
          instagram={clientInstagram}
          mail={clientMail}
          note={clientNote}
          close={closeProfileModal}
        />
      )}

      {addClientClicked && (
        <NewClientModal
          close={closeAddClientModal}
          confirm={confirmAddClient}
        />
      )}

      {editClientClicked && (
        <EditClientModal
          name={clientName}
          phone={clientPhone}
          instagram={clientInstagram}
          email={clientMail}
          note={clientNote}
          close={closeEditClientModal}
          confirm={confirmEditClient}
        />
      )}

      <div className="client-title-container">Klijenti</div>

      <div
        className="new-client-container"
        onClick={() => {
          setAddClientClicked(true);
        }}
      >
        <div className="new-clientIcon-container">
          <AddCircleIcon sx={{ fontSize: 35 }} />
        </div>
      </div>

      <div className="search-client-container">
        <div className="search-icon-container">
          <SearchIcon />
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Pretrazite pomocu imena"
          onChange={handleSearchChange}
          value={searchedClient}
        />
      </div>

      {isLoading ? <Loading /> : (filteredClientsData.length > 0 &&
        filteredClientsData.map((client: Client) => (
          <div key={client.id} className="client-container">
            <div
              className="client-info-container"
              onClick={() => {
                setEditClientClicked(true);
                setClientName(client.name);
                setClientPhone(client.phone);
                setClientInstagram(client.instagram);
                setClientMail(client.email);
                setClientNote(client.note);
                setSelectedClient(client.id as string);
              }}
            >
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

              <div
                className="delete-icon-container"
                onClick={() => {
                  setSelectedClient(client.id as string);
                  setDeleteClicked(true);
                }}
              >
                <DeleteIcon sx={{ fontSize: 30 }} />
              </div>
            </div>
          </div>
        )))}
      <NavBar />
    </div>
  );
}
