
######## High-Level Overview of the API endpoints described below ########

These will all internally delegate to a cart controller (e.g. CartController)

REST endpoints:

  /**
   * POST /cart
   * -------------------------------
   Creates a new telecom cart and a corresponding Salesforce cart context.
   Generates a unique cart ID.
   Initializes an empty cart object in memory.
   Returns the newly created cart with its context ID.
   */
POST /cart             → createCart()

  /**
   * POST /cart/:id/item
   * -------------------------------
   Adds an item (e.g., plan, phone, or accessory) to the specified cart.
   Validates that the cart exists and has not expired.
   Delegates to the SalesforceCartClient to simulate Salesforce behavior.
   Updates the in-memory cart repository with the new item.
   Returns the updated cart state.
   */
POST /cart/:id/item    → addItem()

  /**
   * DELETE /cart/:id/item
   * -------------------------------
   Removes an item from the specified cart.
   Validates that the cart exists and the item is present.
   Updates the cart in-memory and in the SalesforceCartClient test double.
   Returns the updated cart after item removal.
   */
DELETE /cart/:id/item  → removeItem()

  /**
   * GET /cart/:id
   * -------------------------------
   * Retrieves the current state of a specific cart.
   Validates that the cart exists and hasn’t expired.
   Returns the full cart contents including all items and totals.
   */
GET /cart/:id          → getCart()

  /**
   * GET /cart/:id/total
   * -------------------------------
   * Retrieves the current total of the cart.
   Validates that the cart exists and hasn’t expired.
   Returns the full cart total including all items and totals.
   */
GET /cart/:id/total    → getTotal()

