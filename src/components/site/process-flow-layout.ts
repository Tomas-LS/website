import type { ProcessConnection, ProcessNode } from "@/content/projects";

export type ProcessNodePosition = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  centerX: number;
  centerY: number;
};

const connectorClearance = 16;

function decisionAnchor(position: ProcessNodePosition, branchIndex: number) {
  if (branchIndex === 0) return { x: position.centerX, y: position.bottom };
  if (branchIndex === 1) return { x: position.left, y: position.centerY };
  return { x: position.right, y: position.centerY };
}

export function getConnectorPath({
  connection,
  sourceNode,
  position,
  destinationPosition,
  sourceIndex,
  destinationIndex,
  lane,
}: {
  connection: ProcessConnection;
  sourceNode: ProcessNode;
  position: ProcessNodePosition;
  destinationPosition: ProcessNodePosition;
  sourceIndex: number;
  destinationIndex: number;
  lane: number;
}) {
  const isSequential = connection.kind === "sequence" && destinationIndex === sourceIndex + 1;
  const laneX = 12 + (lane % 5) * 10;

  if (connection.kind === "branch" && sourceNode.type === "decision") {
    const branchIndex = connection.branchIndex ?? 0;
    const anchor = decisionAnchor(position, branchIndex);
    if (branchIndex === 0) {
      if (destinationIndex === sourceIndex + 1 && destinationPosition.top >= position.bottom + 8) {
        return [`M ${anchor.x} ${anchor.y}`, `V ${destinationPosition.top - 8}`].join(" ");
      }

      const clearY = position.bottom + connectorClearance;
      const sideLaneX =
        Math.max(4, Math.min(position.left, destinationPosition.left) - connectorClearance) -
        (lane % 3) * 8;
      return [
        `M ${anchor.x} ${anchor.y}`,
        `V ${clearY}`,
        `H ${sideLaneX}`,
        `V ${destinationPosition.centerY}`,
        `H ${destinationPosition.left}`,
      ].join(" ");
    }
    if (branchIndex === 1) {
      return [
        `M ${anchor.x} ${anchor.y}`,
        `H ${laneX}`,
        `V ${destinationPosition.centerY}`,
        `H ${destinationPosition.left}`,
      ].join(" ");
    }
    const rightLaneX =
      Math.max(position.right, destinationPosition.right) + connectorClearance * 2 + (lane % 5) * 8;
    const targetApproachX = destinationPosition.right + connectorClearance;
    return [
      `M ${anchor.x} ${anchor.y}`,
      `H ${rightLaneX}`,
      `V ${destinationPosition.centerY}`,
      `H ${targetApproachX}`,
      `H ${destinationPosition.right}`,
    ].join(" ");
  }

  if (isSequential) {
    return `M ${position.centerX} ${position.bottom} L ${destinationPosition.centerX} ${destinationPosition.top - 8}`;
  }
  return [
    `M ${position.left} ${position.centerY}`,
    `H ${laneX}`,
    `V ${destinationPosition.centerY}`,
    `H ${destinationPosition.left}`,
  ].join(" ");
}

export function getConnectorLabelPosition({
  connection,
  sourceNode,
  position,
  sourceIndex,
  destinationIndex,
  lane = 0,
}: {
  connection: ProcessConnection;
  sourceNode: ProcessNode;
  position: ProcessNodePosition;
  sourceIndex: number;
  destinationIndex: number;
  lane?: number;
}) {
  if (connection.kind !== "branch" || sourceNode.type !== "decision") return null;
  const branchIndex = connection.branchIndex ?? 0;
  const anchor = decisionAnchor(position, branchIndex);
  if (branchIndex === 0) {
    return { x: anchor.x + 8, y: anchor.y + 18, anchor: "start" as const, rotate: 0 };
  }
  if (branchIndex === 1) {
    return {
      x: laneForLabel(position, lane, "left"),
      y: position.centerY - 12,
      anchor: "middle" as const,
      rotate: -90,
    };
  }
  return {
    x: laneForLabel(position, lane, "right"),
    y: position.centerY - 12,
    anchor: "middle" as const,
    rotate: -90,
  };
}

function laneForLabel(position: ProcessNodePosition, lane: number, side: "left" | "right") {
  if (side === "left") return 12 + (lane % 5) * 10;
  return position.right + connectorClearance * 2 + (lane % 5) * 8;
}
