import {Atlas, Parser} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import * as atlasJSON from '../atlas/atlas.json'
import {EntityCollider} from './EntityCollider'
import {EntityParser, EntityConfig} from '../entity/EntityParser'
import {EntityType} from '../entity/EntityType'
import {WH} from '../math/WH'
import {XY} from '../math/XY'
import {CollisionPredicate} from './CollisionPredicate'

const atlas: Atlas = Object.freeze(Parser.parse(atlasJSON))

/** Rectangle intersection scenarios are tested in Rect.test.
    EntityCollider.test exercises the different CollisionPredicate entity
    collision evaluations and tree traversals. */

describe('collidesRect()', () => {
  describe('No collision.', () => {
    test('Collision short-circuited by NEVER.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.NEVER,
          collisionBodies: [{size: {w: 9, h: 9}}]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([])
    })
    test('BODIES but no body intersection.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.BODIES,
          collisionBodies: [{position: {x: 10, y: 10}, size: {w: 9, h: 9}}]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([])
    })
    test('IMAGES but no image intersection.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        <EntityConfig>{
          type: EntityType.IMAGE,
          image: {
            id: AtlasID.PALETTE_BLACK,
            bounds: {position: {x: 10, y: 10}, size: {w: 9, h: 9}}
          },
          collisionPredicate: CollisionPredicate.IMAGES
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([])
    })
    test('CHILDREN short-circuited by failed entity bounds test.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.CHILDREN,
          children: [
            <EntityConfig>{
              type: EntityType.IMAGE,
              image: {
                id: AtlasID.PALETTE_BLACK,
                bounds: {position: {x: 10, y: 10}, size: {w: 9, h: 9}}
              },
              collisionPredicate: CollisionPredicate.IMAGES
            }
          ]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([])
    })
  })

  describe('Parent collision.', () => {
    test('BOUNDS.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.BOUNDS,
          children: [
            <EntityConfig>{
              type: EntityType.IMAGE,
              image: {
                id: AtlasID.PALETTE_BLACK,
                bounds: {size: {w: 9, h: 9}}
              },
              collisionPredicate: CollisionPredicate.IMAGES
            }
          ]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([entity])
    })
    test('BODIES.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.BODIES,
          collisionBodies: [{size: {w: 9, h: 9}}],
          children: [
            <EntityConfig>{
              type: EntityType.IMAGE,
              image: {
                id: AtlasID.PALETTE_BLACK,
                bounds: {size: {w: 9, h: 9}}
              },
              collisionPredicate: CollisionPredicate.IMAGES
            }
          ]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([entity])
    })
    test('IMAGES.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        <EntityConfig>{
          type: EntityType.IMAGE,
          image: {
            id: AtlasID.PALETTE_BLACK,
            bounds: {size: {w: 9, h: 9}}
          },
          collisionPredicate: CollisionPredicate.IMAGES,
          children: [
            <EntityConfig>{
              type: EntityType.IMAGE,
              image: {
                id: AtlasID.PALETTE_WHITE,
                bounds: {size: {w: 1, h: 9}}
              },
              collisionPredicate: CollisionPredicate.IMAGES
            }
          ]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([entity])
    })
  })

  describe('Children.', () => {
    test('One child collides.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.CHILDREN,
          children: [
            {
              type: EntityType.GROUP,
              collisionPredicate: CollisionPredicate.BODIES,
              collisionBodies: [{size: {w: 9, h: 9}}]
            }
          ]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([
        entity.children[0]
      ])
    })
    test('One grandchild collides.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.CHILDREN,
          children: [
            {
              type: EntityType.GROUP,
              collisionPredicate: CollisionPredicate.CHILDREN,
              children: [
                {
                  type: EntityType.GROUP,
                  collisionPredicate: CollisionPredicate.BODIES,
                  collisionBodies: [{size: {w: 9, h: 9}}]
                }
              ]
            }
          ]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([
        entity.children[0].children[0]
      ])
    })
    test('Multiple children collide.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = EntityParser.parse(
        {
          type: EntityType.GROUP,
          collisionPredicate: CollisionPredicate.CHILDREN,
          children: [
            {
              type: EntityType.GROUP,
              collisionPredicate: CollisionPredicate.BODIES,
              collisionBodies: [{size: {w: 9, h: 9}}]
            },
            {
              type: EntityType.GROUP,
              collisionPredicate: CollisionPredicate.BODIES,
              collisionBodies: [{size: {w: 9, h: 9}}]
            }
          ]
        },
        atlas
      )
      expect(EntityCollider.collidesRect(entity, rect)).toStrictEqual([
        entity.children[0],
        entity.children[1]
      ])
    })
  })
})
// [todo] test that only unique entities are returned.
