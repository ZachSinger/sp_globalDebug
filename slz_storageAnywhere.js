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

/*  =====================================================================================================
//         Class Definitions
//  ===================================================================================================*/

class StorageEntry {
    constructor(type, id, quantity){
        this.type = type
        this. ide = id
        this.quantity = quantity
    }
}