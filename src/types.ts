/* eslint-disable @typescript-eslint/naming-convention */
/**
 * This file is part of the vscode-kanban distribution.
 * Copyright (c) Marcel Joachim Kloubert.
 *
 * vscode-kanban is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * vscode-kanban is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Makes a type, so it can also be `null`.
 */
export type CanBeNull<T = any> = T | null;

/**
 * Makes a type, so it can also be `null` or `undefined`.
 */
export type CanBeNullOrUndefined<T = any> = CanBeNull<T> | CanBeUndefined<T>;

/**
 * Makes a type, so it can also be `undefined`.
 */
export type CanBeUndefined<T = any> = T | undefined;

/**
 * A board.
 */
export interface IBoard {
  /**
   * Todo
   */
  "todo": IBoardCard[];
  /**
   * In Progress
   */
  "in-progress": IBoardCard[];
  /**
   * Testing
   */
  "testing": IBoardCard[];
  /**
   * Done
   */
  "done": IBoardCard[];
}

/**
 * A board card.
 */
export interface IBoardCard {
  /**
   * The person, the card is assigned to.
   */
  "assignedTo"?: CanBeNullOrUndefined<IBoardPerson>;
  /**
   * The category.
   */
  "category"?: CanBeNullOrUndefined<string>;
  /**
   * The ISO timestamp, the card has been created.
   */
  "creation_time": string;
  /**
   * The description.
   */
  "description"?: CanBeNullOrUndefined<IBoardContent>;
  /**
   * The details.
   */
  "details"?: CanBeNullOrUndefined<IBoardContent>;
  /**
   * The ID.
   */
  "id": string;
  /**
   * The list of references to other cards.
   */
  "references"?: CanBeNullOrUndefined<string[]>;
  /**
   * The title.
   */
  "title": string;
}

/**
 * A content inside the board.
 */
export interface IBoardContent {
  /**
   * The content or its Base64 representation.
   */
  "content": string;
  /**
   * The mime type.
   */
  "mime": string;
}

/**
 * A person.
 */
export interface IBoardPerson {
  /**
   * The display/full name.
   */
  "name": string
}
