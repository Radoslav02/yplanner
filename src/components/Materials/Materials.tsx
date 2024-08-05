import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Materials.scss";
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
import { Material } from "../../models/material";
import DeleteModal from "../modals/DeleteModal";
import ShowMaterialProfileModal from "../modals/ShowMaterialProfileModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NewMaterialModal from "../modals/NewMaterialModal";
import EditMaterialModal from "../modals/EditMaterialModal";
import SearchIcon from "@mui/icons-material/Search";

export default function Customers() {
  const [materialsData, setMaterialsData] = useState<Material[]>([]);
  const [deleteClicked, setDeleteClicked] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [profileClicked, setProfileClicked] = useState<boolean>(false);
  const [addMaterialClicked, setAddMaterialClicked] = useState<boolean>(false);
  const [editMaterialClicked, setEditMaterialClicked] =
    useState<boolean>(false);
  const [searchedMaterial, setSearchedMaterial] = useState<string>("");
  const [filteredMaterialsData, setFilteredMaterialsData] = useState<
    Material[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [materialManifacturer, setMaterialManifacturer] = useState<string>("");
  const [materialPrice, setMaterialPrice] = useState<string>("");
  const [materialColor, setMaterialColor] = useState<string>("");
  const [materialType, setMaterialType] = useState<string>("");

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.uid) {
      fetchMaterials();
    }
  }, [user]);

  async function fetchMaterials() {
    setIsLoading(true);
    try {
      const materialsCollectionRef = collection(
        db,
        `users/${user!.uid}/materials`
      );
      const materialDocs = await getDocs(materialsCollectionRef);

      const materialsData: Material[] = materialDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Material, "id">),
      }));

      const sortedMaterials = materialsData.sort((a, b) => {
        const manifacturerA = a.manifacturer;
        const manifacturerB = b.manifacturer;
        return manifacturerA.localeCompare(manifacturerB, undefined, {
          sensitivity: "base",
        });
      });

      setMaterialsData(sortedMaterials);
      setFilteredMaterialsData(sortedMaterials);
    } catch (error) {
      console.error("Error fetching Materials", error);
      toast.error("Greška pri dobavljanju materijala iz baze");
    } finally {
      setIsLoading(false);
    }
  }

  async function addMaterial(newMaterial: Material) {
    if (!newMaterial.manifacturer) {
      toast.error("Morate dodati proizvođaca! ");
      return;
    }
    if (!newMaterial.price) {
      toast.error("Morate dodati cenu! ");
      return;
    }
    if (!newMaterial.type) {
      toast.error("Morate dodati tip proizvoda! ");
      return;
    }

    try {
      const materialsCollectionRef = collection(
        db,
        `users/${user!.uid}/materials`
      );
      await addDoc(materialsCollectionRef, newMaterial);

      fetchMaterials();
      toast.success("Materijal uspešno dodat");
      closeAddMaterialModal();
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error("Greška pri dodavanju materijala");
    }
  }

  async function deleteMaterial(materialId: string) {
    try {
      const materialDocRef = doc(
        db,
        `users/${user!.uid}/materials/${materialId}`
      );
      await deleteDoc(materialDocRef);
      setMaterialsData(
        materialsData.filter((material: Material) => material.id !== materialId)
      );

      fetchMaterials();
      setSearchedMaterial("");
      toast.success("Materijal uspešno obrisan");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Greška pri brisanju materijala");
    }
  }

  async function editMaterial(materialId: string, updatedMaterial: Material) {
    try {
      const materialDocRef = doc(
        db,
        `users/${user!.uid}/materials/${materialId}`
      );
      await updateDoc(
        materialDocRef,
        updatedMaterial as { [key: string]: any }
      );

      setMaterialsData(
        materialsData.map((material: Material) =>
          material.id === materialId
            ? { ...material, ...updatedMaterial }
            : material
        )
      );

      fetchMaterials();
      setSearchedMaterial("");
      toast.success("Materijal uspešno izmenjen");
      closeEditMaterialModal();
    } catch (error) {
      console.error("Error editing material:", error);
      toast.error("Greška pri izmeni materijala");
    }
  }

  function closeDeleteModal() {
    setDeleteClicked(false);
  }

  function confirmDelete() {
    if (selectedMaterial) {
      deleteMaterial(selectedMaterial);
    }
  }

  function confirmAddMaterial(newMaterial: Material) {
    addMaterial(newMaterial);
  }

  function confirmEditMaterial(updatedMaterial: Material) {
    if (selectedMaterial) {
      editMaterial(selectedMaterial, updatedMaterial);
    }
  }

  function closeMaterialProfileModal() {
    setProfileClicked(false);
  }

  function closeAddMaterialModal() {
    setAddMaterialClicked(false);
  }

  function closeEditMaterialModal() {
    setEditMaterialClicked(false);
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value;
    setSearchedMaterial(searchValue);

    if (searchValue === "") {
      setFilteredMaterialsData(materialsData);
    } else {
      setFilteredMaterialsData(
        materialsData.filter((material) =>
          material.manifacturer
            .toLowerCase()
            .startsWith(searchValue.toLowerCase())
        )
      );
    }
  }

  return (
    <div className="material-container-wrapper">
      {deleteClicked && (
        <DeleteModal
          heading={"materijal"}
          close={closeDeleteModal}
          confirm={confirmDelete}
        />
      )}

      {profileClicked && (
        <ShowMaterialProfileModal
          heading={"Materijal"}
          color={materialColor}
          manifacturer={materialManifacturer}
          price={materialPrice}
          type={materialType}
          close={closeMaterialProfileModal}
        />
      )}

      {addMaterialClicked && (
        <NewMaterialModal
          close={closeAddMaterialModal}
          confirm={confirmAddMaterial}
        />
      )}

      {editMaterialClicked && (
        <EditMaterialModal
          color={materialColor}
          manifacturer={materialManifacturer}
          price={materialPrice}
          type={materialType}
          close={closeEditMaterialModal}
          confirm={confirmEditMaterial}
        />
      )}

      <div className="material-title-container">Materijali</div>

      <div
        className="new-material-container"
        onClick={() => {
          setAddMaterialClicked(true);
        }}
      >
        <AddCircleIcon className="icon" />
      </div>

      <div className="search-material-container">
        <div className="search-icon-container">
          <SearchIcon />
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Pretražite pomoću proizvođača"
          onChange={handleSearchChange}
          value={searchedMaterial}
        />
      </div>

      {isLoading ? (
        <MoonLoader color="#6c05ff" cssOverride={{}} />
      ) : (
        filteredMaterialsData.length > 0 &&
        filteredMaterialsData.map((material: Material) => (
          <div key={material.id} className="material-container">
            <div
              className="material-info-container"
              onClick={() => {
                setEditMaterialClicked(true);
                setMaterialManifacturer(material.manifacturer);
                setMaterialType(material.type);
                setMaterialPrice(material.price);
                setMaterialColor(material.color);
                setSelectedMaterial(material.id as string);
              }}
            >
              <span className="material-manifacturer">
                Proizvodjac: {material.manifacturer}
              </span>
              <span className="material-type">Tip: {material.type}</span>
              <span className="material-color">Boja: {material.color}</span>
              <span className="material-color">Cena: {material.price}</span>
            </div>

            <div className="material-icons-container">
              <div
                className="profile-icon-container"
                onClick={() => {
                  setProfileClicked(true);
                  setMaterialManifacturer(material.manifacturer);
                  setMaterialType(material.type);
                  setMaterialPrice(material.price);
                  setMaterialColor(material.color);
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 30 }} />
              </div>

              <div
                className="delete-icon-container"
                onClick={() => {
                  setSelectedMaterial(material.id as string);
                  setDeleteClicked(true);
                }}
              >
                <DeleteIcon sx={{ fontSize: 30 }} />
              </div>
            </div>
          </div>
        ))
      )}
      <NavBar />
    </div>
  );
}
