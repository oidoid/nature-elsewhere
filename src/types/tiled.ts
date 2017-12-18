// todo: upstream.

/**
 * Tiled can export maps as JSON files. To do so, simply select "File > Export
 * As" and select the JSON file type. You can export json from the command line
 * with the --export-map option.
 *
 * The fields found in the JSON format differ slightly from those in the TMX Map
 * Format, but the meanings should remain the same.
 *
 * {@link https://web.archive.org/web/20171217041647/http://docs.mapeditor.org/en/latest/reference/json-map-format/}
 * {@link https://web.archive.org/web/20171217041817/http://docs.mapeditor.org/en/latest/reference/tmx-map-format/}
 */
export namespace Tiled {
  export type Integer = number
  export type ObjectID = Integer
  export type GlobalID = Integer

  export interface Properties {
    [name: string]: string
  }

  export interface Terrain {
    /** The name of the terrain type. */
    name: string

    /** Local ID of tile representing terrain. */
    tile: Integer
  }

  export interface Tile {
    /**
     * A length-4 array of terrain indices. Each element is the index of a
     * terrain on one corner of the tile. The order of indices is: top-left,
     * top-right, bottom-left, bottom-right. e.g., [0, 1, 0, 1].
     */
    terrain: Integer[]
  }

  /** (for tileset files, since 1.0). */
  export enum TilesetType {
    TILESET = 'tileset'
  }

  export enum Orientation {
    ORTHOGONAL = 'orthogonal',
    ISOMETRIC = 'isometric',
    STAGGERED = 'staggered',
    HEXAGONAL = 'hexagonal'
  }

  /**
   * This element is only used in case of isometric orientation, and determines
   * how tile overlays for terrain and collision information are rendered.
   */
  export interface Grid {
    /** Orientation of the grid for the tiles in this tileset. */
    orientation: Orientation.ORTHOGONAL | Orientation.ISOMETRIC

    /** Width of a grid cell. */
    width: Integer

    /** Height of a grid cell. */
    height: Integer
  }

  /**
   * This data is used to specify an offset in pixels, to be applied when
   * drawing a tile from the related tileset. When not present, no offset is
   * applied.
   */
  export interface TileOffset {
    /** Horizontal offset in pixels. */
    x: number

    /** Vertical offset in pixels (positive is down). */
    y: number
  }

  export interface Tileset {
    /** The number of tile columns in the tileset. */
    columns: Integer

    /** Identifier corresponding to the first tile in the set. */
    firstgid: GlobalID

    grid?: Grid

    /** Image used for tiles in this set. */
    image: string

    /** Width of source image in pixels. */
    imagewidth: Integer

    /** Height of source image in pixels. */
    imageheight: Integer

    /** Buffer between image edge and first tile in pixels. */
    margin: Integer

    /** Name given to this tileset. */
    name: string

    /**
     * e.g., {"myProperty1": "myProperty1_value"}. Found to be optional by
     * inspection.
     */
    properties?: Properties

    /** e.g., {"myProperty1": "string"}. Found to be optional by inspection. */
    propertytypes?: {[name: string]: string}

    /** Spacing between adjacent tiles in image (pixels). */
    spacing: Integer

    terrains?: Terrain[]

    /** The number of tiles in this tileset. */
    tilecount: Integer

    /** Maximum height of tiles in this set. */
    tileheight: Integer

    tileoffset?: TileOffset

    /** Per-tile properties, indexed by gid as string. Found to be optional by inspection. */
    tileproperties?: {[gid: string]: string}

    /** Mapping from tile ID to tile. */
    tiles?: {[id: string]: Tile}

    /** Maximum width of tiles in this set. */
    tilewidth: Integer

    /** Found to be optional by inspection. */
    type?: TilesetType
  }

  export interface Vertex {
    x: Integer
    y: Integer
  }

  export interface TextProperties {
    text: string

    /** Whether word wrapping is enabled (1) or disabled (0). Defaults to 0. */
    wrap: boolean
  }

  export interface Object {
    /**    ellipse bool Used to mark an object as an ellipse. Found to be optional by inspection */
    ellipse?: boolean

    /** GID, only if object comes from a Tilemap. */
    gid?: GlobalID

    /**
     * Height in pixels. Ignored if using a gid. Found to be floating-point by
     * inspection.
     */
    height: Integer

    /** Incremental id - unique across all objects. */
    id: ObjectID

    /** String assigned to name field in editor. Nonunique, possibly empty. */
    name: string

    /** Used to mark an object as a point. Found to be optional by inspection. */
    point?: boolean

    /** A list of x,y coordinates in pixels. Found to be optional by inspection. */
    polygon?: Vertex[]

    /** A list of x,y coordinates in pixels. Found to be optional by inspection. */
    polyline?: Vertex[]

    /** Found to be optional by inspection. */
    properties?: Properties

    /** float Angle in degrees clockwise. */
    rotation: number

    /** Found to be optional by inspection. */
    text?: TextProperties

    /** String assigned to type field in editor. */
    type: string

    /** Whether object is shown in editor. */
    visible: boolean

    /**
     * Width in pixels. Ignored if using a gid. Found to be floating-point by
     * inspection.
     */
    width: number

    /** x-coordinate in pixels. Found to be floating-point by inspection. */
    x: Integer

    /** y-coordinate in pixels. Found to be floating-point by inspection. */
    y: Integer
  }

  export enum LayerType {
    TILE_LAYER = 'tilelayer',
    OBJECT_GROUP = 'objectgroup',
    IMAGE_LAYER = 'imagelayer',
    GROUP = 'group'
  }

  export interface Layer {
    /**
     * Row count. Same as map height for fixed-size maps. Found to be optional
     * by inspection, at least for OBJECT_GROUPs.
     */
    height?: Integer

    /** Name assigned to this layer. */
    name: string

    /** Between 0 (transparent) and 1 (opaque). */
    opacity: number

    /** e.g., {'tileLayerProp': '1'}. Found to be optional by inspection. */
    properties?: Properties

    type: LayerType

    /** Whether layer is shown or hidden in editor. */
    visible: boolean

    /**
     * Column count. Same as map width for fixed-size maps. Found to be optional
     * by inspection, at least for OBJECT_GROUPs.
     */
    width?: Integer

    /** Horizontal layer offset in tiles. Always 0. */
    x: Integer

    /** Vertical layer offset in tiles. Always 0. */
    y: Integer
  }

  export enum Encoding {
    BASE64 = 'base64',
    CSV = 'csv'
  }

  export interface TileLayer extends Layer {
    type: LayerType.TILE_LAYER

    /**
     * Found to be a string when encoding is BASE64 and a GlobalID[] when
     * encoding is CSV by inspection.
     */
    data: string | GlobalID[]

    /** Found to be present by inspection. */
    encoding: Encoding
  }

  export enum DrawOrder {
    TOP_DOWN = 'topdown',
    INDEX = 'index'
  }

  export interface ObjectGroupLayer extends Layer {
    type: LayerType.OBJECT_GROUP

    /** Defaults to top-down. */
    draworder: DrawOrder

    objects: Object[]
  }

  export interface GroupLayer extends Layer {
    type: LayerType.GROUP
    layers: Layer[]
  }

  /** Since v1.0. */
  export enum MapType {
    MAP = 'map'
  }

  /* The top-level export of a Tiled JSON file. */
  export interface Map {
    /** Hex-formatted color (#RRGGBB or #AARRGGBB). e.g., '#00ff00'. */
    backgroundcolor?: string

    /** Number of tile rows. */
    height: Integer

    /**
     * true if the map has limitless dimensions. Found to be optional by
     * inspection.
     */
    infinite?: boolean

    /** Arranged in draw order. */
    layers: Layer[]

    /**
     * Next object identifier. Auto-increments for each placed object. This
     * number is stored to prevent reuse of the same ID after objects have been
     * removed.
     */
    nextobjectid: ObjectID

    orientation: Orientation

    /**
     * e.g., {'mapProperty1': 'one', 'mapProperty2': 'two'}. Found to be
     * optional by inspection.
     */
    properties?: Properties

    /** The Tiled version used to save the file. e.g., '1.0.3'. */
    tiledversion: string

    /**
     * The height of a grid tile in pixels. Individual tiles may have different
     * sizes but anchored to the bottom-left.
     */
    tileheight: Integer

    /**
     * In ascending Tileset.firstgid order. The first element always has a
     * firstgid value of 1. Image collection tilesets do not necessarily number
     * their tiles consecutively since gaps can occur when removing tiles.
     */
    tilesets: Tileset[]

    /**
     * The width of a grid tile in pixels. Individual tiles may have different
     * sizes but anchored to the bottom-left.
     */
    tilewidth: Integer

    type: MapType

    /** The JSON format version. e.g., 1. */
    version: Integer

    /** Number of tile columns. */
    width: Integer
  }

  export enum RenderOrder {
    RIGHT_DOWN = 'right-down',
    RIGHT_UP = 'right-up',
    LEFT_DOWN = 'left-down',
    LEFT_UP = 'left-up'
  }

  export interface OrthogonalMap extends Map {
    orientation: Orientation.ORTHOGONAL

    /**
     * Rendering direction. In all cases, the map is drawn row-by-row. e.g.,
     * 'right-down'.
     */
    renderorder: RenderOrder
  }
}
