<?php

declare(strict_types=1);

// interface Engine {
//   public function start(): string;
// }

// class V8Engine implements Engine {
//   public function start(): string {
//     return 'V8 engine starts';
//   }
// }

// class HybridEngine implements Engine {
//   public function start(): string {
//     return 'Small engine starts, and electric motors ready to assist';
//   }
// }

// class Car {
//   public function __construct(private Engine $engine) {}
//   public function drive(): string {
//     return $this->engine->start();
//   }
// }

// class Container {
//   private array $bindings = [];

//   public function bind(string $abstract, mixed $concrete): void {
//     $this->bindings[$abstract] = $concrete;
//   }

//   public function make(string $abstract): mixed {
//     $concrete = $this->bindings[$abstract] ?? $abstract;
//     if (is_callable($concrete)) {
//       return $concrete($this);
//     }

//     return $this->build($concrete);
//   }

//   private function build(string $class): object {
//     $reflection = new ReflectionClass($class);
//     $constructor = $reflection->getConstructor();
//     if (!$constructor) {
//       return new $class();
//     }
//     $dependencies = array_map(
//       fn(ReflectionParameter $param) => $this->make($param->getType()->getName()),
//       $constructor->getParameters()
//     );
//     return $reflection->newInstanceArgs($dependencies);
//   }
// }

// $container = new Container();
// $container->bind(Engine::class, V8Engine::class);
// $car = $container->make(Car::class);

// $container2 = new Container();
// $container2->bind(Engine::class, HybridEngine::class);
// $hybridCar = $container2->make(Car::class);

// echo $car->drive();
// echo "\n";
// echo $hybridCar->drive();






// class Logger {
//   public function log(): void {
//     print('logged email');
//   }
// }

// interface Mail {
//   public function sendTo(string $emailAddress): string;
// }

// class MailGun implements Mail {
//   public function sendTo(string $emailAddress): string {
//     return 'Email sent to '.$emailAddress.' via MailGun';
//   }
// }

// class Postmark implements Mail {
//   public function sendTo(string $emailAddress): string {
//     return 'Email sent to '.$emailAddress.' via Postmark';
//   }
// }

// class MailContainer {
//   private array $bindings = [];
//   private array $singletons = [];
//   private array $instances = [];

//   public function bind(string $abstract, mixed $concrete): void {
//     $this->bindings[$abstract] = $concrete;
//   }

//   public function reset(string $abstract) {
//     if (isset($this->singletons[$abstract], $this->instances[$abstract])) {
//       unset($this->singletons[$abstract]);
//       unset($this->instances[$abstract]);
//     }
//   }

//   public function singleton(string $abstract, mixed $concrete): void {
//     $this->bind($abstract, $concrete);
//     $this->singletons[$abstract] = true;
//   }

//   public function make(string $abstract): mixed {
//     if (isset($this->singletons[$abstract], $this->instances[$abstract])) {
//       return $this->instances[$abstract];
//     }

//     $concrete = $this->bindings[$abstract] ?? $abstract;

//     if (is_callable($concrete)) {
//       return $concrete($this);
//     }

//     $instance = $this->build($concrete);

//     if (isset($this->singletons[$abstract])) {
//       $this->instances[$abstract] = $instance;
//     }

//     return $instance;
//   }

//   private function build(string $class): object {
//     $reflection = new ReflectionClass($class);
//     $constructor = $reflection->getConstructor();
//     if (!$constructor) {
//       return new $class;
//     }

//     $dependencies = array_map(
//       fn(ReflectionParameter $param) => $this->make($param->getType()->getName()),
//       $constructor->getParameters()
//     );
//     return $reflection->newInstanceArgs($dependencies);
//   }

// }

// class ReportGenerator {
//   public function __construct(private Mail $mail, private Logger $logger) {
//     $this->mail = $mail;
//     $this->logger = $logger;
//   }
//   public function getReports(): array {
//     return array('messages_sent' => 1000);
//   }
// }


// $emailService = new MailContainer();
// $emailService->singleton(Mail::class, MailGun::class);
// $emailA = $emailService->make(Mail::class);
// $emailB = $emailService->make(Mail::class);
// $mail = $emailB->sendTo('trever@revertcreations.com');


// $emailService->reset(Mail::class);

// echo "\n";
// echo $mail;
// echo "\n";
// var_dump($emailA === $emailB);

// $emailService->bind(Mail::class, Postmark::class);
// $email = $emailService->make(Mail::class);
// $mail = $email->sendTo('trever@revertcreations.com');

// echo "\n";
// echo $mail;

// // question 2 I dunno?

// // question 3
// // $emailService = new MailContainer();
// // $emailService->bind(Mail::class, function(MailContainer $emailService) {
// //   $baseMailer = new Postmark('api-key-123');
// //   return new MetricsMailer($baseMailer);
// // });


// $emailService->bind(ReportGenerator::class, ReportGenerator::class);
// $reporter = $emailService->make(ReportGenerator::class);






interface PaymentGateway {
  public function process();
}

interface Notifier {
  public function notify(string $target);
}

interface FraudChecker {

}

class StripeGateway implements PaymentGateway {
  public function process() {
    echo 'Stripe payment was processed';
  }
}

class PayPalGateway implements PaymentGateway {
  public function process() {
    echo 'PayPal payment was processed';
  }
}

class EmailNotifier implements Notifier {
  public function notify(string $email) {
    echo 'Email: '.$email.' was notified';
  }
}

class SlackNotifier implements Notifier {
  public function notify(string $slackId) {
    echo 'Slack channel '.$channel.' was notified';
  }
}

class BasicFraudChecker implements FraudChecker {

}

class AdvancedFraudChecker implements FraudChecker {

}


class ServiceContainer {
  private array $bindings = [];

  public function bind(string $abstract, string $concrete) {
    $this->bindings[$abstract] = $concrete;
  }

  public function make(string $abstract) {
    $concrete = $this->bindings[$abstract] ?? $abstract;

    return $this->build($concrete);
  }

  private function build(string $class) {
    return new $class;
  }
}

$container = new ServiceContainer();
$container->bind(PaymentGateway::class, StripeGateway::class);
$stripe_payment = $container->make(PaymentGateway::class);
$stripe_payment->process();
