import { mapConfig } from './map-config';

/**
 * Transform a literal coordinate to a user friendly coordinate.
 * User friendly coordinates are the ones with map center to 0, 0 insteaf of literal with center half the map width.
 *
 * @param {number} coordinate Literal coordinate
 *
 * @return { number } User friendly coordinate
 */
export const getFriendlyCoord = (coordinate: number): number => {
	return mapConfig.center[0] - coordinate;
};

/**
 * Transform a user friendly coordinate to a literal coordinate.
 * User friendly coordinates are the ones with map center to 0, 0 insteaf of literal with center half the map width.
 *
 * @param {number} coordinate User friendly coordinate
 *
 * @return { number } Literal coordinate
 */
export const getLiteralCoord = (coordinate: number): number => {
	return mapConfig.center[0] - coordinate;
};
/**
 * Change an absolute coordinate to the opposite side of the map.
 * Example: 512001 => 511999
 *
 * @param {number} coordinate Absolute coordinate to convert
 * @return { number } New coodrinate
 */
export const getOppositeAbsolute = (coordinate: number): number => {
	return -(coordinate - mapConfig.center[0] - mapConfig.center[0]);
};
