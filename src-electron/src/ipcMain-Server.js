import { app } from 'electron'
import express from 'express'
import http from 'http'
import server from './server'

ipcMain.handle('server-start', async(event, server) => {

})

ipcMain.handle('server-restart', async(event, server) => {

})

ipcMain.handle('server-stop', async(event, server) => {

})

ipcMain.handle('server-scan', async(event, server) => {

})
