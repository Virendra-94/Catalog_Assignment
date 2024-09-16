const fs = require('fs');

function parseInput(jsonInput) {
  const data = JSON.parse(jsonInput);
  const { n, k } = data.keys;
  const points = [];

  for (let i = 1; i <= n; i++) {
    if (data[i]) {
      const x = BigInt(i);
      const y = BigInt(parseInt(data[i].value, parseInt(data[i].base)));
      points.push({ x, y });
    }
  }

  return { n, k, points };
}

function lagrangeInterpolation(points, k) {
  const secret = points.slice(0, k).reduce((acc, point, i) => {
    let li = point.y;
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        // Use integer arithmetic to avoid precision issues
        li *= points[j].x; // Multiply by x_j
        li /= (points[j].x - point.x); // Divide by (x_j - x_i)
      }
    }
    return acc + li;
  }, BigInt(0));

  return secret;
}

function solveSecretSharing(jsonInput) {
  const { n, k, points } = parseInput(jsonInput);

  if (points.length < k) {
    throw new Error(`Not enough points provided. Need at least ${k} points.`);
  }

  const secret = lagrangeInterpolation(points, k);
  return secret;
}

// Test cases
const testCases = [
  {
    name: "Test Case 1",
    input: `
    {
      "keys": {
        "n": 4,
        "k": 3
      },
      "1": {
        "base": "10",
        "value": "4"
      },
      "2": {
        "base": "2",
        "value": "111"
      },
      "3": {
        "base": "10",
        "value": "12"
      },
      "6": {
        "base": "4",
        "value": "213"
      }
    }
    `
  },
  {
    name: "Test Case 2",
    input: `
    {
      "keys": {
          "n": 9,
          "k": 6
      },
      "1": {
          "base": "10",
          "value": "28735619723837"
      },
      "2": {
          "base": "16",
          "value": "1A228867F0CA"
      },
      "3": {
          "base": "12",
          "value": "32811A4AA0B7B"
      },
      "4": {
          "base": "11",
          "value": "917978721331A"
      },
      "5": {
          "base": "16",
          "value": "1A22886782E1"
      },
      "6": {
          "base": "10",
          "value": "28735619654702"
      },
      "7": {
          "base": "14",
          "value": "71AB5070CC4B"
      },
      "8": {
          "base": "9",
          "value": "122662581541670"
      },
      "9": {
          "base": "8",
          "value": "642121030037605"
      }
    }
    `
  }
];

// Run test cases
testCases.forEach((testCase) => {
  console.log(`Running ${testCase.name}:`);
  try {
    const secret = solveSecretSharing(testCase.input);
    console.log(`The secret (constant term) is: ${secret}`);
  } catch (error) {
    console.error(`Error in ${testCase.name}:`, error.message);
  }
  console.log('---');
});

// Function to run custom test case from file
function runCustomTestCase(filePath) {
  try {
    const jsonInput = fs.readFileSync(filePath, 'utf8');
    const secret = solveSecretSharing(jsonInput);
    console.log(`Custom Test Case (${filePath}):`);
    console.log(`The secret (constant term) is: ${secret}`);
  } catch (error) {
    console.error(`Error in Custom Test Case (${filePath}):`, error.message);
  }
}