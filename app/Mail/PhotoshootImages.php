<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PhotoshootImages extends Mailable
{
    use Queueable, SerializesModels;

    public $photoshoot;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($photoshoot)
    {
        $this->photoshoot = $photoshoot;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('trever@revertcreations.com')
            ->markdown('admin.emails.photography.images');
    }
}
