import { DependencyContainer }  from "tsyringe";
import { IPostDBLoadMod }       from "@spt-aki/models/external/IPostDBLoadMod";
import { LogTextColor }         from "@spt-aki/models/spt/logging/LogTextColor";
import { ILogger }              from "@spt-aki/models/spt/utils/ILogger";
import { RagfairPriceService }  from "@spt-aki/services/RagfairPriceService";
import { CustomItemService }    from "@spt-aki/services/mod/CustomItemService";
import { DatabaseServer }       from "@spt-aki/servers/DatabaseServer";
import { ConfigServer }         from "@spt-aki/servers/ConfigServer";
import { JsonUtil }             from "@spt-aki/utils/JsonUtil";
import { HashUtil }             from "@spt-aki/utils/HashUtil";
import { API }                  from "../../DJCore/src/api";

import * as moduleArmor         from "../ModuleItems/Armor.json";
import * as moduleBackpacks     from "../ModuleItems/Backpacks.json";
import * as moduleHeadgear      from "../ModuleItems/Headgear.json";
import * as moduleMisc          from "../ModuleItems/Misc.json";
import * as moduleRigs          from "../ModuleItems/Rigs.json";

const fs = require('fs');
const modName = "Tan Gear Module";

class ModuleTanGear implements IPostDBLoadMod
{
    private static apiDepCheck(): boolean 
    {
        const coreMod = "api.js";

        try { const coreApiPath = fs.readdirSync("./user/mods/DJCore/src").map(api => api.toLowerCase()); return coreApiPath.includes(coreMod); }
        catch { return false; }
    }

    /**
    * @param container
    */
    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const tables = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const hashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const customItemService = container.resolve<CustomItemService>("CustomItemService");
        const ragfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService");
        
        if (!ModuleTanGear.apiDepCheck()) { return logger.error(`[${modName}] Error, DJCore API is missing from the user/mods folder.\nPlease install correctly.`) }

		const coreAPI = container.resolve<API>("API");

        for (const vestID in moduleArmor.ArmorTan)
        {
            const vestConfig = moduleArmor.ArmorTan[vestID]

            coreAPI.createItem(vestConfig, customItemService, tables, jsonUtil, configServer, hashUtil, ragfairPriceService);
        }

        for (const backpackID in moduleBackpacks.BackpacksTan)
        {
            const backpackConfig = moduleBackpacks.BackpacksTan[backpackID]

            coreAPI.createItem(backpackConfig, customItemService, tables, jsonUtil, configServer, hashUtil, ragfairPriceService);
        }

        for (const headwearID in moduleHeadgear.HeadwearTan)
        {
            const headwearConfig = moduleHeadgear.HeadwearTan[headwearID]

            coreAPI.createItem(headwearConfig, customItemService, tables, jsonUtil, configServer, hashUtil, ragfairPriceService);
        }

        for (const miscID in moduleMisc.MiscGearTan)
        {
            const miscConfig = moduleMisc.MiscGearTan[miscID]

            coreAPI.createItem(miscConfig, customItemService, tables, jsonUtil, configServer, hashUtil, ragfairPriceService);
        }

        for (const rigID in moduleRigs.RigsTan)
        {
            const rigConfig = moduleRigs.RigsTan[rigID]

            coreAPI.createItem(rigConfig, customItemService, tables, jsonUtil, configServer, hashUtil, ragfairPriceService);
        }

        this.loadModuleBanner(logger);
    }

    private loadModuleBanner(logger: ILogger)
    {
        logger.log(
            `[DJCore] ----------------------------------------------------------------`,
            LogTextColor.MAGENTA
        );
        logger.log(
            `[DJCore]               ${modName} Loaded`,
            LogTextColor.MAGENTA
        );
        logger.log(
            `[DJCore] ----------------------------------------------------------------`,
            LogTextColor.MAGENTA
        );
    }
}

module.exports = { mod: new ModuleTanGear() };