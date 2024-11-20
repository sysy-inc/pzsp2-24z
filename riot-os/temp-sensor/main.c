/*
 * Copyright (C) 2021 Ioannis Chatzigiannakis
 *
 * This file is subject to the terms and conditions of the MIT License.
 * See the file LICENSE in the top level directory for more details.
 */

/**
 * @{
 *
 * @file
 * @brief       Measure the ambient temperature and humidity using a digital
 *              sensor.
 *
 * @author      Ioannis Chatzigiannakis <ichatz@gmail.com>
 *
 * @}
 */

#include <stdio.h>

#include "fmt.h"
#include "dht.h"
#include "dht_params.h"

// #include "periph/pm.h"
// #include "periph/rtc.h"
// #include "shell.h"
#include "periph/gpio.h"
#include "ztimer.h"

/**
 * Call-back function invoked when RTC alarm triggers wakeup.
 */
// static void callback_rtc(void *arg)
// {
//     puts(arg);
// }

bool print_gpio_state(gpio_t pin)
{
    bool state = gpio_read(pin);
    if (state) {
        printf("Pin is high\n");
    } else {
        printf("Pin is low\n");
    }
    return state;
}

int main(void)
{
    puts("Welcome to RIOT!\n");
    puts("Type `help` for help, type `saul` to see all SAUL devices\n");
    int i = 0;
    int tabl[40];
    gpio_t pin = GPIO_PIN(PORT_A, 4);

    // =======
    if (gpio_init(pin, GPIO_OUT) < 0) {
        printf("Error initializing GPIO\n");
        return 1;
    }
    gpio_write(pin, true);
    ztimer_sleep(ZTIMER_MSEC, 500);
    printf("helow\n");

    gpio_write(pin, false);
    ztimer_sleep(ZTIMER_MSEC, 20);

    gpio_write(pin, true);
    if (gpio_init(pin, GPIO_IN) < 0) {
        printf("Error initializing GPIO\n");
        return 1;
    }

    while (gpio_read(pin))
    {
    }
    while (!gpio_read(pin))
    {
    }
    while (gpio_read(pin))
    {
    }

    // here DHT pulled signal down - starting to send data
    while (i < 40)
    {
        while (!gpio_read(pin))
        {
            // waiting for DHT to pull signal up (up when transfering data)
        }
        ztimer_sleep(ZTIMER_USEC, 40);
        // here wa are reading data
        if (gpio_read(pin)) {
            // bit = 1
            tabl[i] = 1;
            i++;
            while (gpio_read(pin))
            {
            }

        } else {
            // bit = 0
            tabl[i] = 0;
            i++;
        }
    }

    printf("=====================================\n");
    int j = 1;
    for (int i = 0; i < 40; i++)
    {
        printf("%d", tabl[i]);
        if (j % 8 == 0) {
            printf("\n");
        }
        j++;
    }
    printf("=====================================\n");

    return 1;
}
