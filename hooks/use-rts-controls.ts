"use client";

import { useEffect, useRef, useState } from 'react';
import { EntityManager, PositionComponent } from '@/lib/game-engine/core';
import { TargetComponent } from '@/lib/game-engine/systems/movement';
import { SelectableComponent } from '@/lib/game-engine/components/selection';
import { CircleColliderComponent } from '@/lib/game-engine/systems/collision';

export function useRTSControls(
  entityManager: EntityManager | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentMouse, setCurrentMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !entityManager) return;

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click
        const pos = getMousePos(e);
        setIsDragging(true);
        setDragStart(pos);
        setCurrentMouse(pos);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setCurrentMouse(getMousePos(e));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const mousePos = getMousePos(e);

      if (e.button === 0 && isDragging) { // Left click selection
        const start = dragStart;
        const end = mousePos;

        // Selection rectangle dimensions
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        const isBox = Math.abs(start.x - end.x) > 5 || Math.abs(start.y - end.y) > 5;

        // Update selected state of entities
        const entities = (entityManager as any).entities;
        for (const entity of (entities.values() as any)) {
          if (entity.hasComponent('selectable') && entity.hasComponent('position')) {
            const pos = entity.getComponent('position') as PositionComponent;
            const selectable = entity.getComponent('selectable') as SelectableComponent;

            if (isBox) {
              selectable.isSelected =
                pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
            } else {
              // Single click selection
              const dx = pos.x - mousePos.x;
              const dy = pos.y - mousePos.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const collider = entity.getComponent('circle-collider') as CircleColliderComponent;
              const radius = collider?.radius || 15;
              selectable.isSelected = dist < radius;
            }
          }
        }
        setIsDragging(false);
      }

      if (e.button === 2) { // Right click movement
        e.preventDefault();
        const entities = (entityManager as any).entities;
        for (const entity of (entities.values() as any)) {
          const selectable = entity.getComponent('selectable') as SelectableComponent;
          if (selectable?.isSelected) {
            entity.addComponent(new TargetComponent(mousePos.x, mousePos.y));
          }
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [entityManager, canvasRef, isDragging, dragStart]);

  return { isDragging, dragStart, currentMouse };
}

