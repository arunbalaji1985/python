import socket

import asyncio
import aiohttp
import requests
import psutil

def get_stats():
    results = {}

    # Push cpu stats of one core for sample
    results['cpu'] = int(psutil.cpu_percent(percpu=True)[0])

    memory = psutil.virtual_memory()
    results['mem'] = int(memory.percent)

    # Push disk space of one partition for sample
    results['disk'] = psutil.disk_usage(psutil.disk_partitions()[0].mountpoint).percent

    return results

# This is my machine's public IP since
# this client must be able to reach my server
# from the outside. You should change this value
# to the IP of the machine you put Crossbar.io
# and Django.
SERVER = '127.0.0.1'

from dataclasses import dataclass

@dataclass
class AgentConfig():
    name: str
    ip: str
    params: dict


# Use Google DNS to find the IP address of the current host
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
agent_config = AgentConfig(name=socket.gethostname(), ip=s.getsockname()[0], params={})
s.close()

async def main():
    """
    Loop sending the state of this machine to a POST endpoint hosted by Django.
    """
    print("Connected")

    # The we loop for ever.
    while True:
        try:
            # Every time we loop, we get the stats for our machine
            stats = {'ip': agent_config.ip, 'name': agent_config.name}
            stats.update(get_stats())

            # Use asyncio to post the stats to django server running in localhost
            async with aiohttp.ClientSession() as session:
                async with session.post('http://' + SERVER + ':8000/api/v1/host/', data=stats) as resp:
                    if resp.status == 200 or resp.status == 201:
                        pass
                    else:
                        txt = await resp.text()
                        print("Could not retrieve configuration for client: {} ({})".format(txt, resp.status))

            await asyncio.sleep(10)
        except Exception as e:
            print("Error in stats loop: {}".format(e))
            break

# We start our client.
if __name__ == '__main__':
    asyncio.run(main())