// AI-generated · AI-managed · AI-maintained
const BASE36_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const USER_LEVELS: Record<number, string> = {
  1: "Miner",
  2: "Miner",
  3: "Miner",
  4: "Commander",
  5: "Pioneer",
  6: "Warden",
  7: "Admiral",
};

export const USER_LEVELS_CN: Record<number, string> = {
  1: "\u77ff\u5de5",
  2: "\u77ff\u5de5",
  3: "\u77ff\u5de5",
  4: "\u6307\u6325\u5b98",
  5: "\u5148\u9a71\u8005",
  6: "\u5b88\u62a4\u8005",
  7: "\u5c06\u519b",
};

export function toBase36(num: number, width: number = 6): string {
  if (num < 0) {
    throw new Error("num must be non-negative");
  }

  if (num === 0) {
    return "0".padStart(width, "0");
  }

  let result = "";
  let n = num;
  while (n > 0) {
    result = BASE36_CHARS[n % 36] + result;
    n = Math.floor(n / 36);
  }

  return result.padStart(width, "0");
}

export function fromBase36(s: string): number {
  return parseInt(s.toUpperCase(), 36);
}

export function getUserShortId(numericId: number): string {
  return `U-${toBase36(numericId, 7)}`;
}

export function getSystemShortId(numericId: number): string {
  return `Y-${toBase36(numericId, 2)}`;
}

export function getSectorShortId(numericId: number): string {
  return `X-${toBase36(numericId, 3)}`;
}

export function getMatrixShortId(numericId: number): string {
  return `M-${toBase36(numericId, 4)}`;
}

export function getStationShortId(numericId: number): string {
  return `S-${toBase36(numericId, 5)}`;
}

export function getUnitShortId(unitType: string, numericId: number): string {
  switch (unitType.toLowerCase()) {
    case "system":
      return getSystemShortId(numericId);
    case "sector":
      return getSectorShortId(numericId);
    case "matrix":
      return getMatrixShortId(numericId);
    default:
      return getStationShortId(numericId);
  }
}

export interface ParsedUnitId {
  unitType: "user" | "system" | "sector" | "matrix" | "station";
  numericId: number;
  shortId: string;
}

export function parseUnitShortId(shortId: string): ParsedUnitId {
  if (!shortId || !shortId.includes("-")) {
    throw new Error(`Invalid short_id format: ${shortId}`);
  }

  const [prefix, base36Id] = shortId.split("-");
  const upperPrefix = prefix.toUpperCase();

  const typeMap: Record<string, ParsedUnitId["unitType"]> = {
    Y: "system",
    X: "sector",
    M: "matrix",
    S: "station",
    U: "user",
  };

  if (!(upperPrefix in typeMap)) {
    throw new Error(`Unknown prefix: ${upperPrefix}`);
  }

  return {
    unitType: typeMap[upperPrefix],
    numericId: fromBase36(base36Id),
    shortId: shortId.toUpperCase(),
  };
}

export function getTerritoryFullPath(
  systemId: number,
  sectorId?: number,
  matrixId?: number,
  stationId?: number
): string {
  const parts = [getSystemShortId(systemId)];

  if (sectorId !== undefined && sectorId !== null) {
    parts.push(getSectorShortId(sectorId));
  }

  if (matrixId !== undefined && matrixId !== null) {
    parts.push(getMatrixShortId(matrixId));
  }

  if (stationId !== undefined && stationId !== null) {
    parts.push(getStationShortId(stationId));
  }

  return parts.join(".");
}

export function getUserLocationId(
  userNumericId: number,
  userLevel: number,
  systemId?: number,
  sectorId?: number,
  matrixId?: number,
  stationId?: number
): string {
  const userPart = getUserShortId(userNumericId);
  const levelPart = `L${userLevel}`;

  let path: string;
  if (systemId !== undefined && systemId !== null) {
    path = getTerritoryFullPath(systemId, sectorId, matrixId, stationId);
  } else {
    path = "-";
  }

  return `${userPart}:${levelPart}@${path}`;
}

export interface ParsedLocationId {
  userShortId: string;
  userNumericId: number;
  userLevel: number;
  userLevelName: string;
  territoryPath: string;
  systemId?: number;
  systemShortId?: string;
  sectorId?: number;
  sectorShortId?: string;
  matrixId?: number;
  matrixShortId?: string;
  stationId?: number;
  stationShortId?: string;
}

export function parseUserLocationId(locationId: string): ParsedLocationId {
  const colonIndex = locationId.indexOf(":");
  const atIndex = locationId.indexOf("@");

  if (colonIndex === -1 || atIndex === -1) {
    throw new Error(`Invalid location_id format: ${locationId}`);
  }

  const userPart = locationId.substring(0, colonIndex);
  const levelPart = locationId.substring(colonIndex + 1, atIndex);
  const path = locationId.substring(atIndex + 1);

  const userInfo = parseUnitShortId(userPart);
  const userLevel = parseInt(levelPart.substring(1), 10);

  const result: ParsedLocationId = {
    userShortId: userPart.toUpperCase(),
    userNumericId: userInfo.numericId,
    userLevel,
    userLevelName: USER_LEVELS[userLevel] || "Unknown",
    territoryPath: path,
  };

  if (path !== "-") {
    const parts = path.split(".");
    for (const part of parts) {
      try {
        const parsed = parseUnitShortId(part);

        switch (parsed.unitType) {
          case "system":
            result.systemId = parsed.numericId;
            result.systemShortId = parsed.shortId;
            break;
          case "sector":
            result.sectorId = parsed.numericId;
            result.sectorShortId = parsed.shortId;
            break;
          case "matrix":
            result.matrixId = parsed.numericId;
            result.matrixShortId = parsed.shortId;
            break;
          case "station":
            result.stationId = parsed.numericId;
            result.stationShortId = parsed.shortId;
            break;
        }
      } catch {
        continue;
      }
    }
  }

  return result;
}

export interface UserRecord {
  numeric_id?: number;
  numericId?: number;
  user_level?: number;
  userLevel?: number;
  territory_id?: string;
  station_id?: number;
  stationId?: number;
  system_id?: number;
  systemId?: number;
  sector_id?: number;
  sectorId?: number;
  matrix_id?: number;
  matrixId?: number;
  parent_system_id?: number;
  parent_sector_id?: number;
  parent_matrix_id?: number;
}

export interface UnitRecord {
  id?: number;
  unit_id?: number;
  unitId?: number;
  unit_type?: string;
  unitType?: string;
  parent_system_id?: number;
  parent_sector_id?: number;
  parent_matrix_id?: number;
  system_id?: number;
  sector_id?: number;
  matrix_id?: number;
}

export function generateUserIds(user: UserRecord): {
  shortId: string | null;
  locationId: string | null;
} {
  const numericId = user.numeric_id ?? user.numericId;

  if (!numericId) {
    return { shortId: null, locationId: null };
  }

  const shortId = getUserShortId(numericId);

  const userLevel = user.user_level ?? user.userLevel ?? 1;
  const systemId =
    user.system_id ?? user.systemId ?? user.parent_system_id ?? 1;
  const sectorId = user.sector_id ?? user.sectorId ?? user.parent_sector_id;
  const matrixId = user.matrix_id ?? user.matrixId ?? user.parent_matrix_id;
  const territoryId = user.territory_id;
  const stationId = territoryId
    ? parseInt(territoryId.replace(/^S-/, ''), 10)
    : (user.station_id ?? user.stationId);

  const locationId = getUserLocationId(
    numericId,
    userLevel,
    systemId,
    sectorId ?? undefined,
    matrixId ?? undefined,
    stationId ?? undefined
  );

  return { shortId, locationId };
}

export function generateUnitIds(unit: UnitRecord): {
  shortId: string | null;
  fullPath: string | null;
} {
  const numericId = unit.id ?? unit.unit_id ?? unit.unitId;
  const unitType = (unit.unit_type ?? unit.unitType ?? "station").toLowerCase();

  if (!numericId) {
    return { shortId: null, fullPath: null };
  }

  const shortId = getUnitShortId(unitType, numericId);

  const systemId = unit.parent_system_id ?? unit.system_id ?? 1;
  const sectorId = unit.parent_sector_id ?? unit.sector_id;
  const matrixId = unit.parent_matrix_id ?? unit.matrix_id;

  let fullPath: string;
  switch (unitType) {
    case "system":
      fullPath = getTerritoryFullPath(numericId);
      break;
    case "sector":
      fullPath = getTerritoryFullPath(systemId, numericId);
      break;
    case "matrix":
      fullPath = getTerritoryFullPath(
        systemId,
        sectorId ?? undefined,
        numericId
      );
      break;
    default:
      fullPath = getTerritoryFullPath(
        systemId,
        sectorId ?? undefined,
        matrixId ?? undefined,
        numericId
      );
  }

  return { shortId, fullPath };
}

export function formatUserId(
  shortId?: string | null,
  numericId?: number | null,
  uid?: string | null
): string {
  if (shortId) return shortId;
  if (numericId) return getUserShortId(numericId);
  if (uid) return uid.substring(0, 8) + "...";
  return "-";
}

export function formatUnitId(
  shortId?: string | null,
  unitType?: string | null,
  unitId?: number | null
): string {
  if (shortId) return shortId;
  if (unitType && unitId) return getUnitShortId(unitType, unitId);
  if (unitId) return `#${unitId}`;
  return "-";
}
