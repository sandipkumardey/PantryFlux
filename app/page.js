'use client';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Import statement for CloseIcon
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to update inventory list
  const updateInventory = async () => {
    setLoading(true);
    try {
      const q = query(collection(firestore, "inventory")); 
      const snapshot = await getDocs(q);
      const inventoryList = [];
      snapshot.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add an item
  const addItem = async (item) => {
    setLoading(true);
    try {
      const docRef = doc(collection(firestore, "inventory"), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      await updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove an item
  const removeItem = async (item) => {
    setLoading(true);
    try {
      const docRef = doc(collection(firestore, "inventory"), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }

      await updateInventory();
    } catch (error) {
      console.error("Error removing item: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to update inventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  // Handlers for opening and closing modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      bgcolor="#e5d9f2"
    >
      {/* Title and Subheadline */}
      <Box mb={4} textAlign="center">
        <Typography variant="h2" color="#00796b" gutterBottom>
          Inventory Management
        </Typography>
        <Typography variant="h6" color="#666">
          Track and manage your inventory items with ease
        </Typography>
      </Box>
      
      <Modal open={open} onClose={handleClose}>
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ outline: 'none' }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Item</Typography>
            <IconButton onClick={handleClose} color="primary">
              <CloseIcon />
            </IconButton>
          </Box>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              label="Item Name"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName.trim());
                  setItemName("");
                  handleClose();
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Add"}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>
        Add Item
      </Button>
      <Box
        borderRadius={2}
        bgcolor="white"
        boxShadow={3}
        width="100%"
        maxWidth="800px"
        p={2}
      >
        <Box
          height="100px"
          bgcolor="#00796b"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px 8px 0 0"
          mb={2}
        >
          <Typography variant="h4" color="white">
            Inventory Items
          </Typography>
        </Box>
        <Stack spacing={2} maxHeight="400px" overflow="auto">
          {inventory.length === 0 && !loading ? (
            <Typography variant="h6" color="#666" textAlign="center">
              No items in inventory.
            </Typography>
          ) : (
            inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="100px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#e0f2f1"
                borderRadius={2}
                padding={2}
                boxShadow={1}
              >
                <Typography variant="h5" color="#00796b">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h5" color="#00796b">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => addItem(name)}
                    disabled={loading}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeItem(name)}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
}