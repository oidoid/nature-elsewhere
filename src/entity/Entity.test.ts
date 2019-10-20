import {Atlas, Parser} from 'aseprite-atlas'
import * as atlasJSON from '../atlas/atlas.json'
import {EntityParser} from './EntityParser'
import {EntityType} from './EntityType'
import {WH} from '../math/WH'
import {XY} from '../math/XY'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Plane} from '../entities/Plane'
import {Rect} from '../math/Rect'

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
      expect(entity.collidesRect(rect)).toStrictEqual([])
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
      expect(entity.collidesRect(rect)).toStrictEqual([])
    })
    test('IMAGES but no image intersection.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = new Plane({
        variant: Plane.Variant.RED,
        collisionPredicate: CollisionPredicate.IMAGES,
        position: new XY(10, 10)
      })
      expect(entity.collidesRect(rect)).toStrictEqual([])
    })
    test('CHILDREN short-circuited by failed entity bounds test.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = new Plane({
        variant: Plane.Variant.RED,
        collisionPredicate: CollisionPredicate.CHILDREN,
        position: new XY(10, 10),
        children: [
          new Plane({
            variant: Plane.Variant.BLUE,
            collisionPredicate: CollisionPredicate.IMAGES
          })
        ]
      })
      expect(entity.collidesRect(rect)).toStrictEqual([])
    })
  })

  describe('Parent collision.', () => {
    test('BOUNDS.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = new Plane({
        variant: Plane.Variant.RED,
        collisionPredicate: CollisionPredicate.BOUNDS,
        children: [
          new Plane({
            variant: Plane.Variant.BLUE,
            collisionPredicate: CollisionPredicate.IMAGES
          })
        ]
      })
      expect(entity.collidesRect(rect)).toStrictEqual([entity])
    })
    test('BODIES.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = new Plane({
        variant: Plane.Variant.RED,
        collisionPredicate: CollisionPredicate.BODIES,
        collisionBodies: [Rect.make(0, 0, 9, 9)],
        children: [
          new Plane({
            variant: Plane.Variant.BLUE,
            collisionPredicate: CollisionPredicate.IMAGES
          })
        ]
      })
      expect(entity.collidesRect(rect)).toStrictEqual([entity])
    })
    test('IMAGES.', () => {
      const rect = {position: new XY(0, 0), size: new WH(9, 9)}
      const entity = new Plane({
        variant: Plane.Variant.RED,
        collisionPredicate: CollisionPredicate.IMAGES,
        children: [
          new Plane({
            variant: Plane.Variant.BLUE,
            collisionPredicate: CollisionPredicate.IMAGES
          })
        ]
      })
      expect(entity.collidesRect(rect)).toStrictEqual([entity])
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
      expect(entity.collidesRect(rect)).toStrictEqual([entity.children[0]])
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
      expect(entity.collidesRect(rect)).toStrictEqual([
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
      expect(entity.collidesRect(rect)).toStrictEqual([
        entity.children[0],
        entity.children[1]
      ])
    })
  })
})
// [todo] test that only unique entities are returned.
