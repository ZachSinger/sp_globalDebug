/*:
* @plugindesc SLZ Storage Anywhere 
* @author SLZ
* @target MZ
* @orderAfter sp_Core
*/

var Imported = Imported || {};
    Imported.storageAnywhere = 'sp_Core';

    var slz = slz || { params: {} };
    slz.storageAnywhere = slz.storageAnywhere || {};

    slz.storageAnywhere.Parameters = PluginManager.parameters('slz.storageAnywhere');