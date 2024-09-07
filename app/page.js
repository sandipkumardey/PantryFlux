'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, boxClasses } from "@mui/material";
import { collection, getDoc, query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [item, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach(element => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    });
    setInventory(inventoryList)
  }

useEffect(() => {
  updateInventory()
}, [])



  return (
    <Box>
    <Typography variant="h1">Welcome to your Next.js app!</Typography>
    {
      inventory.forEach(item => {
        return (<>
        {item.name}
        {item.count}
        </>
        )
    })}
  </Box>
  )
}
