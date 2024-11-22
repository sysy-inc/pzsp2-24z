#include <stdio.h>

#include "periph/gpio.h"
#include "ztimer.h"

// float combineBytes(uint8_t integralPart, uint8_t decimalPart) {
//     // Convert the integral part
//     float integral = (float)integralPart;

//     // Convert the decimal part to a fractional value
//     float decimal = (float)decimalPart / 256.0f;

//     // Combine the two parts
//     return integral + decimal;
// }

int read_dht(gpio_t *pin, int *humidity, int *temp)
{
    int i = 0;
    int tabl[40];
    int hu_integral = 0;
    int hu_decimal = 0;
    int te_integral = 0;
    int te_decimal = 0;

    if (gpio_init(*pin, GPIO_OUT) < 0) {
        printf("Error initializing GPIO\n");
        return 1;
    }
    gpio_write(*pin, true);
    ztimer_sleep(ZTIMER_MSEC, 500);
    printf("helow\n");

    gpio_write(*pin, false);
    ztimer_sleep(ZTIMER_MSEC, 20);

    gpio_write(*pin, true);
    if (gpio_init(*pin, GPIO_IN) < 0) {
        printf("Error initializing GPIO\n");
        return 1;
    }

    while (gpio_read(*pin))
    {
    }
    while (!gpio_read(*pin))
    {
    }
    while (gpio_read(*pin))
    {
    }

    // here DHT pulled signal down - starting to send data
    while (i < 40)
    {
        while (!gpio_read(*pin))
        {
            // waiting for DHT to pull signal up (up when transfering data)
        }
        ztimer_sleep(ZTIMER_USEC, 40);
        // here wa are reading data
        if (gpio_read(*pin)) {
            // bit = 1
            tabl[i] = 1;
            i++;
            while (gpio_read(*pin))
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
        if ( i < 8) {
            hu_integral = hu_integral << 1 | tabl[i];
        } else if (i < 16) {
            hu_decimal = hu_decimal << 1 | tabl[i];
        } else if (i < 24) {
            te_integral = te_integral << 1 | tabl[i];
        } else if (i < 32) {
            te_decimal = te_decimal << 1 | tabl[i];
        }
        printf("%d", tabl[i]);
        if (j % 8 == 0) {
            printf("\n");
        }
        j++;
    }
    printf("====================================\n");
    printf("Humidity: %d.%d %%\n", hu_integral, hu_decimal);
    printf("Temperature: %d.%d °C\n", te_integral, te_decimal);

    if (humidity != 0) {
        *humidity = hu_integral;
    }

    if (temp != 0) {
        *temp = te_integral;
    }

    return 0;

}

int main(void)
{
    puts("Welcome to RIOT!\n");
    puts("Type `help` for help, type `saul` to see all SAUL devices\n");
    gpio_t pin = GPIO_PIN(PORT_A, 4);
    int humidity = 0;
    int temp = 0;
    read_dht(&pin, &humidity, &temp);
    // int i = 0;
    // int tabl[40];
    // int hu_integral = 0;
    // int hu_decimal = 0;
    // int te_integral = 0;
    // int te_decimal = 0;

    // gpio_t pin = GPIO_PIN(PORT_A, 4);

    // if (gpio_init(pin, GPIO_OUT) < 0) {
    //     printf("Error initializing GPIO\n");
    //     return 1;
    // }
    // gpio_write(pin, true);
    // ztimer_sleep(ZTIMER_MSEC, 500);
    // printf("helow\n");

    // gpio_write(pin, false);
    // ztimer_sleep(ZTIMER_MSEC, 20);

    // gpio_write(pin, true);
    // if (gpio_init(pin, GPIO_IN) < 0) {
    //     printf("Error initializing GPIO\n");
    //     return 1;
    // }

    // while (gpio_read(pin))
    // {
    // }
    // while (!gpio_read(pin))
    // {
    // }
    // while (gpio_read(pin))
    // {
    // }

    // // here DHT pulled signal down - starting to send data
    // while (i < 40)
    // {
    //     while (!gpio_read(pin))
    //     {
    //         // waiting for DHT to pull signal up (up when transfering data)
    //     }
    //     ztimer_sleep(ZTIMER_USEC, 40);
    //     // here wa are reading data
    //     if (gpio_read(pin)) {
    //         // bit = 1
    //         tabl[i] = 1;
    //         i++;
    //         while (gpio_read(pin))
    //         {
    //         }

    //     } else {
    //         // bit = 0
    //         tabl[i] = 0;
    //         i++;
    //     }
    // }

    // printf("=====================================\n");
    // int j = 1;
    // for (int i = 0; i < 40; i++)
    // {
    //     if ( i < 8) {
    //         hu_integral = hu_integral << 1 | tabl[i];
    //     } else if (i < 16) {
    //         hu_decimal = hu_decimal << 1 | tabl[i];
    //     } else if (i < 24) {
    //         te_integral = te_integral << 1 | tabl[i];
    //     } else if (i < 32) {
    //         te_decimal = te_decimal << 1 | tabl[i];
    //     }
    //     printf("%d", tabl[i]);
    //     if (j % 8 == 0) {
    //         printf("\n");
    //     }
    //     j++;
    // }
    // printf("=====================================\n");
    // printf("Humidity: %d.%d %%\n", hu_integral, hu_decimal);
    // printf("Temperature: %d.%d °C\n", te_integral, te_decimal);


    return 1;
}
