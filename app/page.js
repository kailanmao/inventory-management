'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { SearchIcon } from '@mui/icons-material/Search'
import { Box, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, IconButton, Icon, Fab, Typography, Stack, Button, Modal, TextField } from '@mui/material'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchClicked, setIsSearchClicked] = useState(false)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchClick = () => {
    setIsSearchClicked(true);
  }

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const displayInventory = isSearchClicked ? filteredInventory : inventory;

  return (
    <Box
      width="100%"
      height="1000px"
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap={2}
      bgcolor="#D7F5FF"
    >
      <Box width="1000px" height="100px" bgcolor="#006494" display='flex' alignItems='center' justifyContent='center'>
        <Typography variant="h2" color="white">
          Pantry Tracker
        </Typography>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position='absolute'
          top='50%'
          left='50%'
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant='outlined'
              fullwidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            <Button variant='outlined' onClick={()=>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      {/* <Typography variant='h1'>Inventory Management</Typography> */}
      <Stack direction="row">
          <TextField
            label="Search items..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outlined" color="primary" onClick={handleSearchClick}>
            Search
          </Button>
          <Button variant="contained" onClick={()=>{
            handleOpen()
          }}>Add New Item</Button>
      </Stack>
      <Box>
        <Box width="1000px" height="100px" bgcolor="#65B6DC" display='flex' alignItems='center' justifyContent='center'>
          <Typography variant="h2" color="#006494">
            Inventory Items
          </Typography>
        </Box>
        <TableContainer sx={{maxHeight: '400px', overflow: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h5">Item</Typography></TableCell>
              <TableCell><Typography variant="h5">Quantity</Typography></TableCell>
              <TableCell><Typography variant="h5">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            {
              displayInventory.map(({name, quantity}) => (
                <TableRow key={name}>
                  <TableCell>{name.charAt(0).toUpperCase() + name.slice(1)}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>
                    <Button padding={1} variant="contained" onClick={() => {
                      addItem(name)
                    }}>Add</Button>
                    <Button padding={1} variant="outlined" onClick={() => {
                      removeItem(name)
                    }}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        </TableContainer>
      {/* <Stack width="1000px" height="600px" spacing={2} overflow="auto">
        {
          displayInventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="50px"
              display="flex"
              alignItems='center'
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={1}
            >
              <Typography variant="h6" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => {
                  addItem(name)
                }}>Add</Button>
                <Button variant="contained" onClick={() => {
                  removeItem(name)
                }}>Remove</Button>
              </Stack>
            </Box>
          ))
        }
      </Stack> */}
      </Box>
    </Box>
  );
}
