"use client";

import { useEstimateFeesPerGas } from "wagmi";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GWEI_TO_ETH = 1e-9;

const DEFAULT_GAS_LIMITS = {
  Ethereum: BigInt(21000), // Basic ETH transfer
  Polygon: BigInt(21000),
  Arbitrum: BigInt(21000)
};

const NETWORK_COIN_IDS = {
  Ethereum: 'ethereum',
  Polygon: 'matic-network',
  Arbitrum: 'ethereum' // Arbitrum uses ETH for gas
} as const;

const NETWORK_STYLES = {
  Ethereum: 'bg-[rgb(var(--network-ethereum))]',
  Polygon: 'bg-[rgb(var(--network-polygon))]',
  Arbitrum: 'bg-[rgb(var(--network-arbitrum))]'
} as const;

async function fetchTokenPrice(network: keyof typeof NETWORK_COIN_IDS): Promise<number> {
  try {
    const coinId = NETWORK_COIN_IDS[network];
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    return response.data[coinId].usd;
  } catch (error) {
    console.error(`Error fetching ${network} price:`, error);
    // Fallback prices
    const fallbackPrices = {
      Ethereum: 2000,
      Polygon: 1,
      Arbitrum: 2000
    };
    return fallbackPrices[network];
  }
}

async function convertGweiToUSD(gwei: bigint, gasLimit: bigint | undefined, network: keyof typeof NETWORK_COIN_IDS): Promise<string> {
  if (!gasLimit) return 'N/A';
  try {
    const tokenPrice = await fetchTokenPrice(network);
    const tokenCost = Number(gwei) * GWEI_TO_ETH * Number(gasLimit);
    return (tokenCost * tokenPrice).toFixed(6);
  } catch (error) {
    console.error('Error converting to USD:', error);
    return 'Error';
  }
}

function GasPriceCard({ name, data, color }: { name: string, data: any, color: string }) {
  const [usdCost, setUsdCost] = useState<string>('Loading...');

  useEffect(() => {
    if (data?.maxFeePerGas) {
      const gasLimit = DEFAULT_GAS_LIMITS[name as keyof typeof DEFAULT_GAS_LIMITS];
      convertGweiToUSD(
        data.maxFeePerGas, 
        gasLimit, 
        name as keyof typeof NETWORK_COIN_IDS
      ).then(setUsdCost);
    }
  }, [data?.maxFeePerGas, name]);

  return (
    <Card className="group transition-all duration-200 hover:scale-105">
      <CardHeader className={`${NETWORK_STYLES[name as keyof typeof NETWORK_STYLES]} text-white rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between">
          {name}
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
            Network
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {data ? (
          <>
            <p className="text-3xl font-bold mb-2 tracking-tight">
              ${(Number(usdCost) / 1e9).toFixed(4)}
              <span className="text-sm font-normal text-muted-foreground ml-1">USD</span>
            </p>
            <p className="text-sm text-muted-foreground">
              ≈ {(Number(data?.maxFeePerGas) / 1e9).toFixed(2)} Gwei
            </p>
          </>
        ) : (
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        )}
      </CardContent>
    </Card>
  );
}

function GasPriceComparison() {
  const { data: ethData } = useEstimateFeesPerGas({ chainId: 1 });
  const { data: polygonData } = useEstimateFeesPerGas({ chainId: 137 });
  const { data: arbitrumData } = useEstimateFeesPerGas({ chainId: 42161 });

  const [sortedNetworks, setSortedNetworks] = useState<Array<{ name: string; data: any; color: string; usdCost?: number }>>([]);

  useEffect(() => {
    const networks = [
      { name: 'Ethereum', data: ethData, color: 'bg-blue-500' },
      { name: 'Polygon', data: polygonData, color: 'bg-purple-500' },
      { name: 'Arbitrum', data: arbitrumData, color: 'bg-blue-400' }
    ];

    Promise.all(
      networks.map(async (network) => {
        if (network.data?.maxFeePerGas) {
          const gasLimit = DEFAULT_GAS_LIMITS[network.name as keyof typeof DEFAULT_GAS_LIMITS];
          const usdCost = await convertGweiToUSD(
            network.data.maxFeePerGas,
            gasLimit,
            network.name as keyof typeof NETWORK_COIN_IDS
          );
          return { ...network, usdCost: Number(usdCost) };
        }
        return { ...network, usdCost: Infinity };
      })
    ).then((networksWithCosts) => {
      setSortedNetworks(
        networksWithCosts.sort((a, b) => (a.usdCost || 0) - (b.usdCost || 0))
      );
    });
  }, [ethData, polygonData, arbitrumData]);

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Gas Price Comparison</h2>
          <p className="text-muted-foreground">
            Compare gas prices across different networks
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedNetworks.map(({ name, data, color }) => (
            <GasPriceCard key={name} name={name} data={data} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <GasPriceComparison />
    </>
  );
}

export default App;
