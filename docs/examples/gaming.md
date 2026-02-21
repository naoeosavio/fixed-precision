# Gaming Calculations with FixedPrecision

FixedPrecision is excellent for game development where deterministic calculations and avoiding floating-point errors are crucial.

## Game Economy and Currency

```typescript
import FixedPrecision from "./FixedPrecision.js";

// Game currency with 2 decimal places (like dollars and cents)
const Currency = FixedPrecision.create({ places: 2, roundingMode: 4 });

// Player wallet
class PlayerWallet {
  private balance: FixedPrecision;
  
  constructor(initialBalance: number | string | bigint) {
    this.balance = Currency(initialBalance);
  }
  
  deposit(amount: FixedPrecision): void {
    this.balance = this.balance.add(amount);
  }
  
  withdraw(amount: FixedPrecision): boolean {
    if (this.balance.gte(amount)) {
      this.balance = this.balance.sub(amount);
      return true;
    }
    return false;
  }
  
  getBalance(): FixedPrecision {
    return this.balance;
  }
  
  // Calculate interest with compounding
  applyInterest(rate: FixedPrecision, periods: number): void {
    // Compound interest: A = P(1 + r/n)^(nt)
    // For simplicity, we'll use annual compounding
    const multiplier = new FixedPrecision(1).add(rate);
    this.balance = this.balance.mul(multiplier.pow(periods));
  }
}

// Example: Player economy
const player = new PlayerWallet(100.50); // $100.50
player.deposit(Currency(25.75));     // Deposit $25.75
player.withdraw(Currency(10.00));    // Withdraw $10.00

console.log(`Balance: $${player.getBalance().toString()}`); // "$116.25"

// Apply 5% interest
const interestRate = Currency(0.05); // 5%
player.applyInterest(interestRate, 1);
console.log(`After interest: $${player.getBalance().toString()}`); // "$122.06"
```

## Game Physics and Movement

```typescript
// 2D Vector with fixed precision
class Vector2D {
  constructor(
    public x: FixedPrecision,
    public y: FixedPrecision
  ) {}
  
  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x.add(other.x), this.y.add(other.y));
  }
  
  sub(other: Vector2D): Vector2D {
    return new Vector2D(this.x.sub(other.x), this.y.sub(other.y));
  }
  
  mul(scalar: FixedPrecision): Vector2D {
    return new Vector2D(this.x.mul(scalar), this.y.mul(scalar));
  }
  
  length(): FixedPrecision {
    return this.x.pow(2).add(this.y.pow(2)).sqrt();
  }
  
  normalize(): Vector2D {
    const len = this.length();
    if (len.eq(0)) return new Vector2D(new FixedPrecision(0), new FixedPrecision(0));
    return new Vector2D(this.x.div(len), this.y.div(len));
  }
  
  dot(other: Vector2D): FixedPrecision {
    return this.x.mul(other.x).add(this.y.mul(other.y));
  }
}

// Example: Character movement
const position = new Vector2D(
  new FixedPrecision(100),
  new FixedPrecision(150)
);

const velocity = new Vector2D(
  new FixedPrecision(5),
  new FixedPrecision(-3)
);

const acceleration = new Vector2D(
  new FixedPrecision(0),
  new FixedPrecision(-9.8) // Gravity
);

// Update position: p = p + v*dt + 0.5*a*dt²
const dt = new FixedPrecision(0.016); // ~60 FPS
const newPosition = position
  .add(velocity.mul(dt))
  .add(acceleration.mul(dt).mul(dt).div(2));

console.log(`New position: (${newPosition.x}, ${newPosition.y})`);
```

## Damage Calculation and Combat

```typescript
// Damage calculation with fixed precision
class DamageCalculator {
  static calculateDamage(
    attackPower: FixedPrecision,
    defense: FixedPrecision,
    criticalChance: FixedPrecision,
    criticalMultiplier: FixedPrecision
  ): FixedPrecision {
    // Base damage formula
    let damage = attackPower.mul(
      new FixedPrecision(100).div(
        new FixedPrecision(100).add(defense)
      )
    );
    
    // Critical hit chance
    const random = new FixedPrecision(Math.random());
    if (random.lt(criticalChance)) {
      damage = damage.mul(criticalMultiplier);
    }
    
    // Round to nearest integer for display
    return damage.withConfig({ places: 0 });
  }
  
  static calculateDPS(
    damage: FixedPrecision,
    attackSpeed: FixedPrecision,
    accuracy: FixedPrecision
  ): FixedPrecision {
    // DPS = damage * attackSpeed * accuracy
    return damage.mul(attackSpeed).mul(accuracy);
  }
}

// Example: Combat calculation
const attackPower = new FixedPrecision(150);
const defense = new FixedPrecision(50);
const criticalChance = new FixedPrecision(0.15); // 15%
const criticalMultiplier = new FixedPrecision(2.0); // 2x

const damage = DamageCalculator.calculateDamage(
  attackPower,
  defense,
  criticalChance,
  criticalMultiplier
);

console.log(`Damage: ${damage.toString()}`);

// Calculate DPS
const attackSpeed = new FixedPrecision(1.5); // 1.5 attacks per second
const accuracy = new FixedPrecision(0.95); // 95% accuracy
const dps = DamageCalculator.calculateDPS(damage, attackSpeed, accuracy);

console.log(`DPS: ${dps.toString()}`);
```

## Experience and Leveling Systems

```typescript
// Experience system with fixed precision
class ExperienceSystem {
  private static readonly BASE_XP = new FixedPrecision(100);
  private static readonly GROWTH_FACTOR = new FixedPrecision(1.1);
  
  static xpForLevel(level: number): FixedPrecision {
    // Exponential growth: XP = BASE * GROWTH^(level-1)
    return this.BASE_XP.mul(this.GROWTH_FACTOR.pow(level - 1));
  }
  
  static totalXpForLevel(level: number): FixedPrecision {
    // Sum of XP for all levels up to target
    let total = new FixedPrecision(0);
    for (let i = 1; i <= level; i++) {
      total = total.add(this.xpForLevel(i));
    }
    return total;
  }
  
  static levelFromXp(xp: FixedPrecision): number {
    let level = 1;
    let xpNeeded = this.xpForLevel(level);
    
    while (xp.gte(xpNeeded)) {
      xp = xp.sub(xpNeeded);
      level++;
      xpNeeded = this.xpForLevel(level);
    }
    
    return level - 1; // Return completed level
  }
  
  static xpProgress(xp: FixedPrecision, currentLevel: number): FixedPrecision {
    const xpForCurrentLevel = this.xpForLevel(currentLevel);
    const xpIntoLevel = xp.sub(this.totalXpForLevel(currentLevel - 1));
    return xpIntoLevel.div(xpForCurrentLevel);
  }
}

// Example: Level progression
const playerXp = new FixedPrecision(5000);
const playerLevel = ExperienceSystem.levelFromXp(playerXp);
const progress = ExperienceSystem.xpProgress(playerXp, playerLevel);

console.log(`Level: ${playerLevel}`);
console.log(`Progress to next level: ${progress.mul(100).toString()}%`);

// XP needed for next level
const xpForNextLevel = ExperienceSystem.xpForLevel(playerLevel + 1);
console.log(`XP needed for level ${playerLevel + 1}: ${xpForNextLevel.toString()}`);
```

## Inventory and Item Management

```typescript
// Item with weight and value
class GameItem {
  constructor(
    public name: string,
    public weight: FixedPrecision,
    public value: FixedPrecision,
    public quantity: FixedPrecision = new FixedPrecision(1)
  ) {}
  
  totalWeight(): FixedPrecision {
    return this.weight.mul(this.quantity);
  }
  
  totalValue(): FixedPrecision {
    return this.value.mul(this.quantity);
  }
}

// Inventory with weight limits
class Inventory {
  private items: GameItem[] = [];
  private maxWeight: FixedPrecision;
  private currentWeight: FixedPrecision = new FixedPrecision(0);
  
  constructor(maxWeight: FixedPrecision) {
    this.maxWeight = maxWeight;
  }
  
  addItem(item: GameItem): boolean {
    const itemWeight = item.totalWeight();
    const newWeight = this.currentWeight.add(itemWeight);
    
    if (newWeight.gt(this.maxWeight)) {
      return false; // Too heavy
    }
    
    this.items.push(item);
    this.currentWeight = newWeight;
    return true;
  }
  
  removeItem(index: number): GameItem | null {
    if (index < 0 || index >= this.items.length) return null;
    
    const item = this.items[index];
    this.currentWeight = this.currentWeight.sub(item.totalWeight());
    this.items.splice(index, 1);
    
    return item;
  }
  
  getTotalValue(): FixedPrecision {
    return this.items.reduce(
      (total, item) => total.add(item.totalValue()),
      new FixedPrecision(0)
    );
  }
  
  getWeightPercentage(): FixedPrecision {
    return this.currentWeight.div(this.maxWeight).mul(100);
  }
}

// Example: Inventory management
const inventory = new Inventory(new FixedPrecision(100)); // 100kg capacity

const sword = new GameItem("Sword", new FixedPrecision(5), new FixedPrecision(50));
const potion = new GameItem("Health Potion", new FixedPrecision(0.5), new FixedPrecision(10), new FixedPrecision(10));
const armor = new GameItem("Armor", new FixedPrecision(25), new FixedPrecision(200));

inventory.addItem(sword);
inventory.addItem(potion);
inventory.addItem(armor);

console.log(`Inventory value: ${inventory.getTotalValue().toString()} gold`);
console.log(`Weight: ${inventory.getWeightPercentage().toString()}% full`);
```

## Random Number Generation with Fixed Precision

```typescript
// Deterministic random number generator for games
class GameRNG {
  private seed: bigint;
  
  constructor(seed: number | string | bigint) {
    this.seed = BigInt(seed);
  }
  
  // Linear congruential generator
  next(): FixedPrecision {
    const a = 1664525n;
    const c = 1013904223n;
    const m = 2n ** 32n;
    
    this.seed = (a * this.seed + c) % m;
    
    // Convert to fixed precision between 0 and 1
    const scaled = this.seed * 100000000n / m;
    return new FixedPrecision(scaled).div(100000000);
  }
  
  nextInt(min: number, max: number): number {
    const range = new FixedPrecision(max - min + 1);
    const random = this.next().mul(range);
    return min + Number(random.withConfig({ places: 0 }).toString());
  }
  
  nextFloat(min: FixedPrecision, max: FixedPrecision): FixedPrecision {
    const range = max.sub(min);
    return min.add(this.next().mul(range));
  }
}

// Example: Deterministic random numbers
const rng = new GameRNG(12345); // Fixed seed for reproducibility

console.log("Random numbers:");
for (let i = 0; i < 5; i++) {
  console.log(`  ${rng.next().toString()}`);
}

// Random item drop
const dropChance = new FixedPrecision(0.05); // 5% drop chance
const roll = rng.next();
if (roll.lt(dropChance)) {
  console.log("Rare item dropped!");
}

// Random damage variation
const baseDamage = new FixedPrecision(100);
const variation = new FixedPrecision(0.2); // ±20%
const randomFactor = rng.nextFloat(
  new FixedPrecision(1).sub(variation),
  new FixedPrecision(1).add(variation)
);
const finalDamage = baseDamage.mul(randomFactor);
console.log(`Damage with variation: ${finalDamage.toString()}`);
```

## Game State Serialization

```typescript
// Serialize game state with fixed precision
class GameState {
  constructor(
    public playerHealth: FixedPrecision,
    public playerMana: FixedPrecision,
    public playerGold: FixedPrecision,
    public gameTime: FixedPrecision
  ) {}
  
  serialize(): string {
    return JSON.stringify({
      playerHealth: this.playerHealth.toString(),
      playerMana: this.playerMana.toString(),
      playerGold: this.playerGold.toString(),
      gameTime: this.gameTime.toString(),
      // Include configuration for deserialization
      config: {
        places: 8,
        roundingMode: 4
      }
    });
  }
  
  static deserialize(data: string): GameState {
    const parsed = JSON.parse(data);
    return new GameState(
      new FixedPrecision(parsed.playerHealth),
      new FixedPrecision(parsed.playerMana),
      new FixedPrecision(parsed.playerGold),
      new FixedPrecision(parsed.gameTime)
    );
  }
}

// Example: Save and load game state
const gameState = new GameState(
  new FixedPrecision(100),    // Health
  new FixedPrecision(50),     // Mana
  new FixedPrecision(1234.56), // Gold
  new FixedPrecision(3600)    // Game time in seconds
);

const saved = gameState.serialize();
console.log("Saved game state:", saved);

const loaded = GameState.deserialize(saved);
console.log("Loaded health:", loaded.playerHealth.toString());
```

## Best Practices for Game Development

1. **Use Consistent Precision**: Choose appropriate precision (usually 2-4 places for currency, 8+ for physics)
2. **Deterministic Calculations**: Use fixed seeds for RNG to ensure reproducible gameplay
3. **Performance Optimization**: Use raw operations for performance-critical game loops
4. **State Management**: Serialize game state with precision information
5. **Error Handling**: Validate game calculations to prevent invalid states
6. **Testing**: Test edge cases (zero values, maximum values, boundary conditions)