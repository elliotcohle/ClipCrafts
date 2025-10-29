const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ChannelAPI', {
  listPackages: () => ipcRenderer.invoke('listPackages'),
  updateStatus: (pkgPath, type, status) => ipcRenderer.invoke('updateStatus', pkgPath, type, status),
  updateSocial: (pkgPath, type, social) => ipcRenderer.invoke('updateSocial', pkgPath, type, social),
  openPackage: (pkgPath) => ipcRenderer.invoke('openPackage', pkgPath),
  getPackageFiles: (pkgPath, type) => ipcRenderer.invoke('getPackageFiles', pkgPath, type),
  savePackageFile: (pkgPath, fileName, content) => ipcRenderer.invoke('savePackageFile', pkgPath, fileName, content),
  updateMetaDates: (pkgPath, createdDate, publishDate) => ipcRenderer.invoke('updateMetaDates', pkgPath, createdDate, publishDate),
  updateScore: (pkgPath, score) => ipcRenderer.invoke('updateScore', pkgPath, score),
  updateManualOrder: (items) => ipcRenderer.invoke('updateManualOrder', items),
  buildDashboard: () => ipcRenderer.invoke('buildDashboard'),
  openDashboard: () => ipcRenderer.invoke('openDashboard'),
  createPackage: (payload) => ipcRenderer.invoke('createPackage', payload),
  createChannel: () => ipcRenderer.invoke('createChannel'),
  saveThumbnail: (pkgPath, imageData) => ipcRenderer.invoke('saveThumbnail', pkgPath, imageData),
  deleteThumbnail: (pkgPath) => ipcRenderer.invoke('deleteThumbnail', pkgPath),
  deletePackage: (pkgPath, type) => ipcRenderer.invoke('deletePackage', pkgPath, type),
});
