#include <stdio.h>

#include "shell.h"
#include "msg.h"
#include "ztimer.h"

#include <inttypes.h>

#include "net/gnrc.h"
#include "net/gnrc/ipv6.h"
#include "net/gnrc/netif.h"
#include "net/gnrc/netif/hdr.h"
#include "net/gnrc/pktdump.h"
#include "net/gnrc/udp.h"
#include "net/utils.h"
#include "shell.h"
#include "timex.h"
#include "utlist.h"

void gnrc_udp_send(const char *addr_str, const char *port_str,
                   const char *data, size_t data_len, size_t num, unsigned int delay)
{
    netif_t *netif;
    uint16_t port;
    ipv6_addr_t addr;

    /* parse destination address */
    if (netutils_get_ipv6(&addr, &netif, addr_str) < 0)
    {
        printf("Error: unable to parse destination address\n");
        return;
    }
    /* parse port */
    port = atoi(port_str);
    if (port == 0)
    {
        printf("Error: unable to parse destination port\n");
        return;
    }

    while (num--)
    {
        gnrc_pktsnip_t *payload, *udp, *ip;
        unsigned payload_size;
        /* allocate payload */
        payload = gnrc_pktbuf_add(NULL, data, data_len, GNRC_NETTYPE_UNDEF);
        if (payload == NULL)
        {
            printf("Error: unable to copy data to packet buffer\n");
            return;
        }
        /* store size for output */
        payload_size = (unsigned)payload->size;
        /* allocate UDP header, set source port := destination port */
        udp = gnrc_udp_hdr_build(payload, port, port);
        if (udp == NULL)
        {
            printf("Error: unable to allocate UDP header\n");
            gnrc_pktbuf_release(payload);
            return;
        }
        /* allocate IPv6 header */
        ip = gnrc_ipv6_hdr_build(udp, NULL, &addr);
        if (ip == NULL)
        {
            printf("Error: unable to allocate IPv6 header\n");
            gnrc_pktbuf_release(udp);
            return;
        }
        /* add netif header, if interface was given */
        if (netif != NULL)
        {
            gnrc_pktsnip_t *netif_hdr = gnrc_netif_hdr_build(NULL, 0, NULL, 0);
            if (netif_hdr == NULL)
            {
                printf("Error: unable to allocate netif header\n");
                gnrc_pktbuf_release(ip);
                return;
            }
            gnrc_netif_hdr_set_netif(netif_hdr->data,
                                     container_of(netif, gnrc_netif_t, netif));
            ip = gnrc_pkt_prepend(ip, netif_hdr);
        }
        /* send packet */
        if (!gnrc_netapi_dispatch_send(GNRC_NETTYPE_UDP,
                                       GNRC_NETREG_DEMUX_CTX_ALL, ip))
        {
            printf("Error: unable to locate UDP thread\n");
            gnrc_pktbuf_release(ip);
            return;
        }
        /* access to `payload` was implicitly given up with the send operation
         * above
         * => use temporary variable for output */
        printf("Success: sent %u byte(s) to [%s]:%u\n", payload_size, addr_str,
               port);
        if (num)
        {
#if IS_USED(MODULE_ZTIMER_USEC)
            ztimer_sleep(ZTIMER_USEC, delay);
#elif IS_USED(MODULE_XTIMER)
            xtimer_usleep(delay);
#elif IS_USED(MODULE_ZTIMER_MSEC)
            ztimer_sleep(ZTIMER_MSEC, (delay + US_PER_MS - 1) / US_PER_MS);
#endif
        }
    }
}
